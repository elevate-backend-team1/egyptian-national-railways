import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Card {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  cardholderName: string;

  @Prop({ required: true })
  cardNumber: string;

  @Prop({ required: true })
  expiryMonth: number;

  @Prop({ required: true })
  expiryYear: number;

  @Prop({ required: true })
  cvv: string;
}

export type CardDocument = Card & Document;
export const CardSchema = SchemaFactory.createForClass(Card);
