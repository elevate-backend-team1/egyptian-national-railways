import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Schedule {
  @Prop({ type: Types.ObjectId, ref: 'Route', required: true })
  routeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Train', required: true })
  trainId: Types.ObjectId;

  @Prop({ required: true })
  date: string; // YYYY-MM-DD

  @Prop({ required: true })
  departureTime: string; // HH:mm

  @Prop({ required: true })
  arrivalTime: string; // HH:mm

  @Prop({ required: true, min: 1 })
  durationMinutes: number;

  @Prop({ enum: ['وصل', 'متأخر', 'ملغى'], default: 'وصل' })
  status_ar: string;

  @Prop({ enum: ['on_time', 'delayed', 'cancelled'], default: 'on_time' })
  status_en: string;

  @Prop({ default: true })
  isActive: boolean;
}

export type ScheduleDocument = Schedule & Document;
export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
