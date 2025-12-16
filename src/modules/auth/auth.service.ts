import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt.config';
import { createUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.shcema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from './schemas/otp.schema';
import { MailService } from 'src/common/mail/mail.service';
import { updateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiResponse, ResponseStatus } from 'src/common/interfaces/response.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiResponses } from 'src/common/dto/response.dto';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Otp.name)
    private otpModel: Model<OtpDocument>,
    private mailService: MailService
  ) {}

  /**
   * Generate an access token
   */
  generateAccessToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: jwtConfig.accessTokenExpiration
    });
  }

  /**
   * Generate a refresh token
   */
  generateRefreshToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: jwtConfig.refreshTokenExpiration
    });
  }

  /**
   * Verify and decode a token
   */
  async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Generate both access and refresh tokens
   */
  generateTokens(payload: TokenPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload)
    };
  }

  async create(createUser: createUserDto) {
    const hashedPassword = await bcrypt.hash(createUser.password, 10);
    const user = await this.userModel.create({
      email: createUser.email,
      password_hash: hashedPassword
    });
    if (!user) {
      throw new BadRequestException('User registration failed');
    }
    return user;
  }

  async completeRegister(email: string, updateData: updateUserDto) {
    return this.userModel.findOneAndUpdate(
      { email },
      {
        full_name: updateData.fullName,
        phone: updateData.phoneNumber,
        national_id: updateData.nationalId,
        role: 'passenger',
        verified: true
      },
      { new: true }
    );
  }

  async generateOtp(email: string) {
    const existing = await this.otpModel.findOne({
      email,
      is_valid: true,
      expires_at: { $gt: new Date() }
    });

    if (existing) {
      throw new BadRequestException('OTP already sent. Try again later.');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.otpModel.create({
      email,
      code,
      expires_at: expiresAt
    });

    await this.mailService.sendOtpEmail(email, code);

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(email: string, code: string) {
    const otpRecord = await this.otpModel.findOne({ email, code, is_valid: true });

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP');
    }
    if (otpRecord.expires_at < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    otpRecord.is_valid = false;
    await otpRecord.save();

    // update user verified status
    await this.userModel.findOneAndUpdate({ email }, { verified: true });

    return { message: 'OTP verified successfully' };
  }

  async resendOtp(email: string) {
    await this.otpModel.updateMany({ email, is_valid: true }, { is_valid: false });
    return this.generateOtp(email);
  }

  async login(body: LoginDto): Promise<ApiResponse> {
    const { password, email } = body;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.password_hash !== password) {
      throw new BadRequestException('Invalid password');
    }

    if (!user.verified) {
      throw new BadRequestException('User is not verified');
    }

    const accessToken = this.generateAccessToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return {
      data: {
        accessToken
      },
      status: ResponseStatus.SUCCESS
    };
  }
  /**
   * change logged user password service
   */
  async changeUserPassword(userId: string, body: ChangePasswordDto) {
    // Find user
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // Check if current password matches
    const isMatch = await bcrypt.compare(body.currentPassword, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }
    // update user password
    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    user.password_hash = hashedPassword;

    await user.save();

    return ApiResponses.success('Password updated successfully', null);
  }

  /**
   * forgot password service
   */
  async forgotPassword(email: ForgotPasswordDto) {
    // check user email
    const user = await this.userModel.findOne({ email: email.email });
    if (!user) {
      throw new NotFoundException(`User with email ${email.email} not found`);
    }
    // generate and send OTP
    try {
      await this.generateOtp(user.email);
      // Update user status to pendingVerification
      user.verified = false;
      await user.save();
    } catch (error) {
      // Update user status to VERIFIED in case of failure
      user.verified = true;
      await user.save();

      throw new InternalServerErrorException('Failed to send password reset code', error.message);
    }

    return ApiResponses.success('Password reset code sent to your email', null);
  }

  /**
   * reset password service
   */
  async resetPassword(dto: ResetPasswordDto) {
    // update user password
    const user = await this.userModel.findOneAndUpdate(
      { email: dto.email },
      {
        password: await bcrypt.hash(dto.newPassword, 10)
      }
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return ApiResponses.success('Password has been reset successfully', null);
  }
}
