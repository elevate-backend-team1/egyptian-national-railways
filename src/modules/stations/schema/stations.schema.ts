import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CoordinatesDto } from '../dto/create-station.dto';
import { HydratedDocument } from 'mongoose';

export type StationDocument = HydratedDocument<Station>;

@Schema({ timestamps: true })
export class Station {
  @Prop({ required: true, trim: true })
  name_en: string;

  @Prop({ required: true })
  name_ar: string;

  @Prop({ required: true, trim: true, index: true })
  city_en: string;

  @Prop({ required: true, index: true })
  city_ar: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  km_from_main_zero: number;

  @Prop({ required: true, type: CoordinatesDto })
  location: CoordinatesDto;
}

const StationSchema = SchemaFactory.createForClass(Station);
export const StationModel = MongooseModule.forFeature([{ name: Station.name, schema: StationSchema }]);
