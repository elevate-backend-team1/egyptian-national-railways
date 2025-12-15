import { IsEmail, IsNotEmpty, IsString, Length, Matches, ValidateIf } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 32, {
    message: 'New password must be at least 8 characters long '
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @Match('newPassword', { message: 'confirm password must match new password' })
  @ValidateIf((o) => o.newPassword === o.confirmNewPassword, {
    message: 'new password and confirm password do not match'
  })
  confirmNewPassword: string;
}
