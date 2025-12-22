import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { Onboarding } from './schemas/onboarding.schema';

@ApiTags('Onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new onboarding step' })
  @ApiResponse({ status: 201, description: 'Onboarding step created successfully', type: Onboarding })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateOnboardingDto })
  create(@Body() createOnboardingDto: CreateOnboardingDto): Promise<Onboarding> {
    return this.onboardingService.create(createOnboardingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all onboarding steps' })
  @ApiQuery({ name: 'language', required: false, description: 'Language for onboarding steps', example: 'en' })
  @ApiResponse({ status: 200, description: 'List of onboarding steps', type: [Onboarding] })
  findAll(@Query('language') language: string): Promise<Onboarding[]> {
    return this.onboardingService.findAll(language || 'en');
  }
}
