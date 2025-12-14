import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters' })
  //   @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).+$/, {
  //     message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  //   })
  password: string;
}
