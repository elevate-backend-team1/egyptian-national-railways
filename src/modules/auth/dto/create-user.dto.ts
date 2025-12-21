import { IsEmail, IsString, Matches, MinLength, Validate, ValidateIf, ValidationArguments } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'User password (must contain at least 8 characters, one uppercase, one lowercase, and one number)'
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  })
  password: string;

  @ApiProperty({ example: 'StrongP@ssw0rd', description: 'Confirm password (must match the password field)' })
  @IsString()
  @ValidateIf((O: createUserDto) => !!O.password)
  @Validate(
    (value: string, args: ValidationArguments) => {
      const object = args.object as createUserDto;
      return value === object.password;
    },
    { message: 'Passwords do not match' }
  )
  confirmPassword: string;
}
