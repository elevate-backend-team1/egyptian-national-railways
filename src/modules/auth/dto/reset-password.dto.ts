import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'NewP@ssw0rd',
    description: 'New password (must be 8-32 characters, contain uppercase, lowercase, number, and special character)'
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 32, {
    message: 'New password must be at least 8 characters long '
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: `
    New password must contain at least one uppercase letter,
    one lowercase letter, one number,
    and one special character
    `
  })
  newPassword: string;

  @ApiProperty({
    example: 'NewP@ssw0rd',
    description: 'Confirm new password (must match the newPassword field)'
  })
  @IsNotEmpty()
  @IsString()
  @Match('newPassword', { message: 'confirm password must match new password' })
  // @ValidateIf((o) => o.newPassword === o.confirmNewPassword, {
  //   message: 'new password and confirm password do not match'
  // })
  confirmNewPassword: string;
}
