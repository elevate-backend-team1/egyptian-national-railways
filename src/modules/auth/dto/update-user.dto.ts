import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class updateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  full_name: string;

  @ApiProperty({
    example: '+201012345678',
    description: 'Egyptian mobile phone number'
  })
  @Matches(/^(?:\+20|0020|0)?1[0125]\d{8}$/, { message: 'Invalid Egyptian phone number' })
  phone: string;

  @ApiProperty({
    example: '29801011234567',
    description: 'Egyptian national ID (14 digits)'
  })
  @MinLength(14, { message: 'National ID must be exactly 14 digits' })
  @MaxLength(14, { message: 'National ID must be exactly 14 digits' })
  @Matches(/^\d{14}$/, { message: 'National ID must contain only digits' })
  @Matches(/^[23]/, { message: 'National ID must start with 2 (1900s) or 3 (2000s)' })
  @Matches(/^(2[0-9]|3[0-9])/, {
    message: 'First two digits must represent valid birth year'
  })
  national_id: string;
}
