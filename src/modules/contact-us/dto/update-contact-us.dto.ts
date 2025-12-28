import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateContactUsDto } from './create-contact-us.dto';
import { ContactStatus } from '../enum/contact-status.enum';

export class UpdateContactUsDto extends PartialType(CreateContactUsDto) {
  @ApiProperty({
    description: 'Status of the contact request',
    enum: ContactStatus,
    example: ContactStatus.IN_PROGRESS,
    required: false
  })
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;
}
