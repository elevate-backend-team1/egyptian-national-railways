import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFAQsDto {
  @ApiProperty({
    description: 'Arabic question text',
    example: 'كيف يمكنني حجز تذكرة؟'
  })
  @IsNotEmpty()
  @IsString()
  ar_question: string;

  @ApiProperty({
    description: 'English question text',
    example: 'How can I book a ticket?'
  })
  @IsNotEmpty()
  @IsString()
  en_question: string;

  @ApiProperty({
    description: 'Arabic answer text',
    example: 'يمكنك حجز التذكرة عبر الموقع الإلكتروني أو التطبيق'
  })
  @IsNotEmpty()
  @IsString()
  ar_answer: string;

  @ApiProperty({
    description: 'English answer text',
    example: 'You can book a ticket through the website or mobile app'
  })
  @IsNotEmpty()
  @IsString()
  en_answer: string;

  @ApiProperty({
    description: 'Sort order for display priority',
    example: 1,
    minimum: 0,
    maximum: 1000
  })
  @IsNumber()
  @Min(0)
  @Max(1000)
  sort_order: number;
}
