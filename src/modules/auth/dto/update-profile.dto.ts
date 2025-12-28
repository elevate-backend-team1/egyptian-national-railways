import { IsEmail, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { updateUserDto } from './update-user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProfileDto extends PartialType(updateUserDto) {
  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'User new email address'
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
