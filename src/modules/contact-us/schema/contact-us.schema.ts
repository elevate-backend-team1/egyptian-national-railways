import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ContactStatus } from '../enum/contact-status.enum';

@Schema({ timestamps: true })
export class ContactUs {
  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  subject: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ required: true, enum: ContactStatus, default: ContactStatus.PENDING })
  status: ContactStatus;
}

export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);
export type ContactUsDocument = HydratedDocument<ContactUs>;
