import { 
  Injectable, 
  BadRequestException, 
  NotFoundException,
  InternalServerErrorException 
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { OTPService } from '../services/otp.service';
import { MailService } from '../../mail/mail.service';
import { SignUpDto } from '../dto/signup.dto';
import { VerifyOTPDto } from '../dto/verify-otp.dto';
import { ResendOTPDto } from '../dto/resend-otp.dto';
import { CompleteProfileDto } from '../dto/complete-profile.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private otpService: OTPService,
    private mailService: MailService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ message: string; email: string }> {
    const { email, password, confirmPassword } = signUpDto;

    // Double-check password match (already validated in DTO but extra safety)
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Create user
    const user = await this.usersService.create({ email, password });

    // Generate and send OTP
    try {
      const otp = await this.otpService.generateOTP(user._id.toString);
      await this.mailService.sendOTP(email, otp);
    } catch (error) {
      // If OTP sending fails, we could delete the user or handle the error
      throw new InternalServerErrorException('Failed to send verification code');
    }

    return {
      message: 'Verification code sent to your email',
      email: user.email,
    };
  }

  async verifyOTP(verifyOTPDto: VerifyOTPDto): Promise<{ 
    message: string; 
    tempToken: string;
    email: string;
  }> {
    const { email, otp } = verifyOTPDto;

    // Find user
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check user status
    if (user.status !== 'pendingVerification') {
      throw new BadRequestException('Account already verified');
    }

    // Verify OTP
    const isValid = await this.otpService.verifyOTP(user._id.toString(), otp);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    // Update user status
    await this.usersService.verifyEmail(user._id.toString());

    // Generate temporary token for profile completion
    const tempToken = this.generateTempToken(user._id.toString());

    return {
      message: 'Successfully verified',
      tempToken,
      email: user.email,
    };
  }

  async resendOTP(resendOTPDto: ResendOTPDto): Promise<{ message: string }> {
    const { email } = resendOTPDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already verified
    if (user.status !== 'pendingVerification') {
      throw new BadRequestException('Account already verified');
    }

    // Generate new OTP
    const otp = await this.otpService.generateOTP(user._id.toString);
    
    // Send new OTP
    const sent = await this.mailService.sendOTP(email, otp);
    if (!sent) {
      throw new InternalServerErrorException('Failed to resend verification code');
    }

    return { message: 'Verification code resent successfully' };
  }

  async completeProfile(
    userId: string,
    completeProfileDto: CompleteProfileDto,
  ): Promise<{ message: string; user: any }> {
    const user = await this.usersService.completeProfile(userId, completeProfileDto);
    
    // Here you can generate a full JWT for login
    // const accessToken = this.generateAccessToken(user);

    return {
      message: 'Profile completed successfully',
      user: {
        id: user._id.toString,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        status: user.status,
      },
    };
  }

  async validateTempToken(token: string): Promise<{ valid: boolean; userId?: string }> {
    const userId = this.verifyTempToken(token);
    return {
      valid: !!userId,
      userId,
    };
  }

  async getOTPStatus(email: string): Promise<{ 
    exists: boolean; 
    expiresAt?: Date;
    attempts?: number;
  }> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      return { exists: false };
    }

    const otpRecord = await this.otpService.getOTPRecord(user._id.toString());
    
    if (!otpRecord) {
      return { exists: false };
    }

    return {
      exists: true,
      expiresAt: otpRecord.expiresAt,
      attempts: otpRecord.attempts,
    };
  }

  private generateTempToken(userId: string): string {
    // Generate a simple temporary token (in production use JWT)
    // This is just an example, you should use @nestjs/jwt in production
    const payload = { 
      sub: userId, 
      type: 'temp',
      exp: Math.floor(Date.now() / 1000) + (60 * 30) // 30 minutes
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  private verifyTempToken(token: string): string | null {
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString());
      if (payload.type !== 'temp' || payload.exp < Date.now() / 1000) {
        return null;
      }
      return payload.sub;
    } catch {
      return null;
    }
  }
}