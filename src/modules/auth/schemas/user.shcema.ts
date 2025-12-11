import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({ enum: ['admin', 'passenger'], default: 'passenger' })
  role: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop({ unique: true })
  national_id: string;

  @Prop({ required: true, default: false })
  verified: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
