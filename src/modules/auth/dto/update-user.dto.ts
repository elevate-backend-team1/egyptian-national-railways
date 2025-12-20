import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class updateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '+20123456789', description: 'User phone number' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: '12345678901234', description: 'User national ID' })
  @IsString()
  nationalId: string;
}
