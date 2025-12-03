import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Onboarding, OnboardingDocument } from './schemas/onboarding.schema';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectModel(Onboarding.name)
    private onboardingModel: Model<OnboardingDocument>,
  ) {}

  async create(createOnboardingDto: CreateOnboardingDto): Promise<Onboarding> {
    const newOnboarding = new this.onboardingModel(createOnboardingDto);
    return newOnboarding.save();
  }

  async findAll(language: string): Promise<Onboarding[]> {
    return this.onboardingModel.find({ language }).exec();
  }

  async findByLanguage(language: string): Promise<Onboarding[]> {
    return this.onboardingModel.find({ language }).exec();
  }
}
