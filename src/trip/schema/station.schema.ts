import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Station {
  @Prop({ required: true })
  name_en: string;

  @Prop({ required: true })
  name_ar: string;

  @Prop({ required: true, index: true })
  city_ar: string;

  @Prop({ required: true, index: true })
  city_en: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  km_from_main_zero: number;

  @Prop({ type: { lat: Number, lng: Number } })
  geo_location: { lat: number; lng: number };
}
export type StationDocument = Station & Document;

export const StationSchema = SchemaFactory.createForClass(Station);
