import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrainDocument = Train & Document;

export enum TrainType {
  EXPRESS = 'express',
  REGULAR = 'regular',
  VIP = 'vip',
  SLEEPER = 'sleeper'
}

export enum TrainStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service'
}

@Schema({ timestamps: true })
export class Train {
  @Prop({ required: true, unique: true, trim: true })
  trainNumber: string;

  @Prop({ required: true, trim: true })
  trainName: string;

  @Prop({
    required: true,
    enum: TrainType,
    default: TrainType.REGULAR
  })
  type: TrainType;

  @Prop({
    required: true,
    enum: TrainStatus,
    default: TrainStatus.ACTIVE
  })
  status: TrainStatus;

  @Prop({ required: true, min: 1 })
  totalSeats: number;

  @Prop({ required: true, min: 1 })
  cars: number; // Number of cars

  @Prop({ min: 0, default: 0 })
  firstClassSeats: number;

  @Prop({ min: 0, default: 0 })
  secondClassSeats: number;

  @Prop({ min: 0, default: 0 })
  thirdClassSeats: number;

  @Prop({ type: [String], default: [] })
  amenities: string[]; // e.g., ['wifi', 'ac', 'dining', 'power_outlets']

  @Prop({ min: 0 })
  maxSpeed: number; // Maximum speed in km/h

  @Prop()
  manufacturer: string;

  @Prop()
  yearManufactured: number;

  @Prop()
  lastMaintenanceDate: Date;

  @Prop()
  nextMaintenanceDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

const TrainSchema = SchemaFactory.createForClass(Train);
export const TrainModel = MongooseModule.forFeature([{ name: Train.name, schema: TrainSchema }]);

// Add indexes for better query performance
TrainSchema.index({ type: 1, status: 1 });
TrainSchema.index({ status: 1 });

// Virtual property to check if maintenance is due
TrainSchema.virtual('isMaintenanceDue').get(function () {
  if (!this.nextMaintenanceDate) return false;
  return new Date() >= this.nextMaintenanceDate;
});

// Virtual property to get train age
TrainSchema.virtual('trainAge').get(function () {
  if (!this.yearManufactured) return null;
  return new Date().getFullYear() - this.yearManufactured;
});

// Ensure virtuals are included when converting to JSON
TrainSchema.set('toJSON', { virtuals: true });
TrainSchema.set('toObject', { virtuals: true });
