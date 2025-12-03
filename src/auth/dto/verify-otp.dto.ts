import { IsNotEmpty, Length, IsEmail } from 'class-validator';

export class VerifyOTPDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP Should be 6 nums' })
  otp: string;
}