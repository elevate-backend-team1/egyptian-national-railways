// src/auth/dto/complete-profile.dto.ts
import { IsNotEmpty, Length, Matches, IsString } from 'class-validator';

export class CompleteProfileDto {
  @IsNotEmpty({ message: 'Please Insert your full name' })
  @IsString()
  fullName: string;

  @IsNotEmpty({ message: 'Please insert your phone number' })
  phone: string;

  @IsNotEmpty({ message: 'Please insert your National ID Number' })
  @Length(14, 14, { message: 'National ID should be 14 Number' })
  nationalId: string;
}