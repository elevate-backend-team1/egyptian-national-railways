import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OnboardingDocument = Onboarding & Document;

@Schema()
export class Onboarding {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true, enum: ['en', 'ar'] })
  language: string;
}

export const OnboardingSchema = SchemaFactory.createForClass(Onboarding);
