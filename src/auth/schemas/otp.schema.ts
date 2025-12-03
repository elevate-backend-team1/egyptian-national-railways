import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OTPDocument = OTP & Document;

@Schema({ timestamps: true })
export class OTP {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: 0 })
  attempts: number;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: 'email' })
  type: string;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);