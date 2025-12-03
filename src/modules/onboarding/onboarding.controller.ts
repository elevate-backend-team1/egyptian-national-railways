import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { Onboarding } from './schemas/onboarding.schema';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  create(
    @Body() createOnboardingDto: CreateOnboardingDto,
  ): Promise<Onboarding> {
    return this.onboardingService.create(createOnboardingDto);
  }

  @Get()
  findAll(@Query('language') language: string): Promise<Onboarding[]> {
    return this.onboardingService.findAll(language || 'en');
  }
}
