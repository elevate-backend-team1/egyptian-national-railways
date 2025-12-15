import { IsEmail, IsString, Matches, MinLength, Validate, ValidateIf, ValidationArguments } from 'class-validator';

export class createUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).+$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  })
  password: string;

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
