import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOTPDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}