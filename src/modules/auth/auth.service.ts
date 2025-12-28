import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { ApiResponses } from 'src/common/dto/response.dto';
import { handleServiceError } from 'src/common/utils/errorHandler';
import { randomUUID } from 'crypto';
import { TokenBlacklistService } from './token-blacklist.service';
import { AuthRequest } from 'src/common/interfaces/AuthRequest.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  jti: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Otp.name)
    private otpModel: Model<OtpDocument>,
    private mailService: MailService,
    private tokenBlacklistService: TokenBlacklistService
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
  generateTokens(payload: TokenPayload): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload)
    };
  }

  async create(createUser: createUserDto): Promise<User> {
    const hashedPassword: string = await bcrypt.hash(createUser.password, 10);
    const user = await this.userModel.create({
      email: createUser.email,
      password_hash: hashedPassword
    });
    if (!user) {
      throw new BadRequestException('User registration failed');
    }
    return user;
  }

  // complete user profile data
  async completeRegister(email: string, updateData: updateUserDto) {
    return this.userModel.findOneAndUpdate({ email }, updateData, { new: true });
  }

  // generate otp service
  async generateOtp(email: string): Promise<{ message: string }> {
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

  // verify otp service
  async verifyOtp(email: string, code: string): Promise<{ message: string }> {
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

  // resend otp service
  async resendOtp(email: string): Promise<{ message: string }> {
    await this.otpModel.updateMany({ email, is_valid: true }, { is_valid: false });
    return this.generateOtp(email);
  }

  // login service
  async login(body: LoginDto): Promise<ApiResponse> {
    const { password, email } = body;

    const user = await this.userModel.findOne({ email }).select('+password_hash');

    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      throw new BadRequestException('Invalid password');
    }

    if (!user.verified) {
      throw new BadRequestException('User is not verified');
    }

    const accessToken = this.generateAccessToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      jti: randomUUID()
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
  async changeUserPassword(userId: string, body: ChangePasswordDto): Promise<ApiResponses<null>> {
    // Find user & select password field
    const user = await this.userModel.findById(userId).select('+password_hash');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // Check if current password matches
    const isMatch: boolean = await bcrypt.compare(body.currentPassword, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }
    // update user password
    const hashedPassword: string = await bcrypt.hash(body.newPassword, 10);
    user.password_hash = hashedPassword;

    await user.save();

    return ApiResponses.success('Password updated successfully', null);
  }

  /**
   * forgot password service
   */
  async forgotPassword(email: ForgotPasswordDto): Promise<ApiResponses<null>> {
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
    } catch (error: unknown) {
      // Update user status to VERIFIED in case of failure
      user.verified = true;
      await user.save();

      handleServiceError(error);
    }

    return ApiResponses.success('Password reset code sent to your email', null);
  }

  /**
   * Logout service
   */
  async logout(req: AuthRequest): Promise<ApiResponses<null>> {
    // get token data from user obj in req
    const { jti, exp } = req.user;

    // blacklist the token & save in db
    await this.tokenBlacklistService.blacklist(jti, exp);

    return ApiResponses.success('Logged out successfully', null);
  }

  /**
   * update profile data
   */
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    // check user exist
    const currentUser = await this.userModel.findById(userId);
    if (!currentUser) {
      throw new NotFoundException('User logged out');
    }
    // check if user need to change email
    if (updateProfileDto.email) {
      // update profile data & verified = false
      await this.userModel.findByIdAndUpdate(userId, { ...updateProfileDto, verified: false });
      // send otp to new email
      return await this.generateOtp(updateProfileDto.email);
    } else {
      const updatedProfile = await this.userModel.findByIdAndUpdate(userId, updateProfileDto, { new: true });
      return updatedProfile;
    }
  }
}
