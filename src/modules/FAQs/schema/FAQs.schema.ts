import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class FAQs {
  @Prop({ required: true })
  ar_question: string;

  @Prop({ required: true })
  en_question: string;

  @Prop({ required: true })
  ar_answer: string;

  @Prop({ required: true })
  en_answer: string;

  @Prop({ required: true })
  sort_order: number;
}
export const FAQsSchema = SchemaFactory.createForClass(FAQs);
export type FAQsDocument = HydratedDocument<FAQs>;
