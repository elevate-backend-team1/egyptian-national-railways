import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Class {
  FIRST = 'first',
  SECOND = 'second',
  THIRD = 'third'
}

export type Car = {
  carNumber: number;
  class: Class;
  totalSeats: number;
  unavailableSeats: number[]; // Array of seat numbers that are unavailable
};

export enum TrainTypeEN {
  REGULAR = 'regular',
  VIP = 'vip',
  EXPRESS = 'express',
  SLEEPER = 'sleeper'
}

export enum TrainTypeAr {
  REGULAR = 'عادي',
  VIP = 'مميز',
  EXPRESS = 'سريع',
  SLEEPER = 'نوم'
}

export type TrainDocument = Train & Document;
@Schema({ timestamps: true })
export class Train {
  @Prop({ required: true, unique: true })
  trainNumber: string;

  @Prop({ required: true })
  type_en: TrainTypeEN;

  @Prop({ required: true })
  type_ar: TrainTypeAr;

  @Prop({ required: true })
  base_rate_per_km: number;

  @Prop({ required: true })
  min_fare: number;

  // @Prop({ default: 5 })
  // insurance_fee: number;

  // @Prop({ default: 10 })
  // reservation_fee: number;

  @Prop({ required: true })
  cars: Car[];

  @Prop({ default: true })
  isActive: boolean;
}

const TrainSchema = SchemaFactory.createForClass(Train);
export const TrainModel = MongooseModule.forFeature([{ name: Train.name, schema: TrainSchema }]);

// Add indexes for better query performance
TrainSchema.index({ type: 1, status: 1 });
TrainSchema.index({ status: 1 });
