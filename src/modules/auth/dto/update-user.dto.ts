import { IsString } from 'class-validator';

export class updateUserDto {
  @IsString()
  fullName: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  nationalId: string;
}
