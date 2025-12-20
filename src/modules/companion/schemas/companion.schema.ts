import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
@Schema({ timestamps: true })
export class Companion {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner_user_id: Types.ObjectId;

  @Prop({ required: true })
  full_name: string;

  @Prop()
  national_id?: string;

  @Prop()
  birth_date?: Date;

  @Prop({ required: true })
  gender: string;

  @Prop()
  phone?: string;
}
export type CompanionDocument = Companion & Document;
export const CompanionSchema = SchemaFactory.createForClass(Companion);
export const companionModel = MongooseModule.forFeature([{ name: Companion.name, schema: CompanionSchema }]);
CompanionSchema.index({ owner_user_id: 1, national_id: 1 }, { unique: true });
