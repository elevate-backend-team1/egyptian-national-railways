import { IsNotEmpty, IsString, IsEmail, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactUsDto {
  @ApiProperty({
    description: 'Email address of the person',
    example: 'john.doe@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Subject of the message',
    example: 'Inquiry about train schedules',
    minLength: 5,
    maxLength: 200
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  subject: string;

  @ApiProperty({
    description: 'The message content',
    example: 'I would like to know about the train schedules from Cairo to Alexandria.',
    minLength: 10,
    maxLength: 2000
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message: string;
}
