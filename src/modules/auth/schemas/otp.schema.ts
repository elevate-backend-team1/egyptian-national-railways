import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  expires_at: Date;

  @Prop({ default: true })
  is_valid: boolean;
}
export type OtpDocument = Otp & Document;

export const OtpSchema = SchemaFactory.createForClass(Otp);
