import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt.config';
import { createUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.shcema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from './schemas/otp.schema';
import { MailService } from 'src/common/mail/mail.service';
import { updateUserDto } from './dto/update-user.dto';

export interface TokenPayload {
  sub: string;
  email: string;
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
    return this.userModel.create({
      email: createUser.email,
      password_hash: createUser.password
    });
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

    return { message: 'OTP verified successfully' };
  }

  async resendOtp(email: string) {
    await this.otpModel.updateMany({ email, is_valid: true }, { is_valid: false });
    return this.generateOtp(email);
  }
}
