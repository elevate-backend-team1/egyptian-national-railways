import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Schedule {
  @Prop({ type: Types.ObjectId, ref: 'Route', required: true })
  route_id: Types.ObjectId;

  @Prop({ required: true }) date: string; // YYYY-MM-DD
  @Prop({ required: true }) departure_time: string; // HH:mm
  @Prop({ required: true }) arrival_time: string; // HH:mm

  @Prop({ enum: ['وصل', 'متأخر', 'ملغى'], default: 'وصل' })
  status_ar: string;

  @Prop({ enum: ['on_time', 'delayed', 'cancelled'], default: 'on_time' })
  status_en: string;
}

export type ScheduleDocument = Schedule & Document;
export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
