import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'example@example.com', description: 'User email address' })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd', description: 'User password' })
  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters' })
  //   @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).+$/, {
  //     message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  //   })
  password: string;
}
