import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserStatus {
  PENDING_VERIFICATION = 'pendingVerification',
  VERIFIED = 'verified',
  ACTIVE = 'active',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId; 

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: UserStatus.PENDING_VERIFICATION, enum: UserStatus })
  status: UserStatus;

  @Prop()
  fullName: string;

  @Prop()
  phone: string;

  @Prop()
  nationalId: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  lastLoginAt: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);