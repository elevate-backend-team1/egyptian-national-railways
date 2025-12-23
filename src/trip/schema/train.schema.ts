import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TrainCar } from '../interface/train-car.interface';
import { HydratedDocument } from 'mongoose';
@Schema({ timestamps: true })
export class Train {
  @Prop({ required: true, unique: true }) train_number: string;

  @Prop({ required: true, enum: ['TALGO', 'VIP', 'SPANISH', 'RUSSIAN_AC', 'RUSSIAN_DYNAMIC', 'LOCAL'] })
  type_en: string;

  @Prop({ required: true, enum: ['تالجو', 'خاص', 'اسباني', 'روسى', 'روسى ديناميك', 'محلي'] })
  type_ar: string;

  // منطق التسعير الخاص بهذا القطار
  @Prop({ required: true }) base_rate_per_km: number;
  @Prop({ required: true }) min_fare: number;
  @Prop({ default: 5 }) insurance_fee: number;
  @Prop({ default: 10 }) reservation_fee: number;

  @Prop({
    type: [
      {
        car_number: Number,
        class: { type: String, enum: ['first', 'second', 'third'] },
        total_seats: Number,
        unavailable_seats_numbers: [Number]
      }
    ],
    default: []
  })
  cars: TrainCar[];
}
export type TrainDocument = HydratedDocument<Train>;
export const TrainSchema = SchemaFactory.createForClass(Train);
