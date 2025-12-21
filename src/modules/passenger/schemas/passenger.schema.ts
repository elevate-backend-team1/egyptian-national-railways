// src/passengers/passengers.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PassengerDocument = Passenger & Document;

@Schema({ timestamps: true })
export class Passenger {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  nationalId: string;

  @Prop({ required: true })
  name: string;
}

export const PassengerSchema = SchemaFactory.createForClass(Passenger);
