import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class SignUpDto {
  @IsEmail({}, { message: 'Email address not valid' })
  @IsNotEmpty({ message: 'Please Insert your email' })
  email: string;

  @IsNotEmpty({ message: 'Please insert password' })
  @MinLength(8, { message: 'Password shoud be cantain 8 chars at least' })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, {
    message: 'Password should have one or more capital',
  })
  password: string;

  @IsNotEmpty({ message: 'Please confirm your password' })
  @Match('password', { message: 'Password dosnot match' })
  confirmPassword: string;
}