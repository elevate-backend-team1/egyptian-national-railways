import { ApiProperty } from '@nestjs/swagger';

export class CreateOnboardingDto {
  @ApiProperty({ example: 'Welcome to Egyptian Railways', description: 'Title of the onboarding step' })
  title: string;
  @ApiProperty({ example: 'Learn how to book your first ticket', description: 'Description of the onboarding step' })
  description: string;
  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL of the onboarding image' })
  imageUrl: string;
  @ApiProperty({ example: 'en', description: 'Language code for the onboarding step' })
  language: string;
}
