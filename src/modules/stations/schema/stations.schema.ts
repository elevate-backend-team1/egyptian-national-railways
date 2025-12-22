import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type StationDocument = Station & Document;

@Schema({ timestamps: true })
export class Station {
  @Prop({ required: true })
  name_en: string;

  @Prop({ required: true })
  name_ar: string;

  @Prop({ required: true, index: true })
  city_en: string;

  @Prop({ required: true, index: true })
  city_ar: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  km_from_main_zero: number;

  @Prop({ type: { lat: Number, lng: Number } })
  location: { lat: number; lng: number };
}

const StationSchema = SchemaFactory.createForClass(Station);
export const StationModel = MongooseModule.forFeature([{ name: Station.name, schema: StationSchema }]);
