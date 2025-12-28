import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TrainTypeAr, TrainTypeEN } from '../enums/train-type.enum';
import { Car } from '../type/train-car.type';

export type TrainDocument = HydratedDocument<Train>;
@Schema({ timestamps: true })
export class Train {
  @Prop({ required: true, unique: true })
  trainNumber: string;

  @Prop({ required: true })
  type_en: TrainTypeEN;

  @Prop({ required: true })
  type_ar: TrainTypeAr;

  @Prop({ required: true })
  base_rate_per_km: number;

  @Prop({ required: true })
  min_fare: number;

  // @Prop({ default: 5 })
  // insurance_fee: number;

  // @Prop({ default: 10 })
  // reservation_fee: number;

  @Prop({ required: true })
  cars: Car[];

  @Prop({ default: true })
  isActive: boolean;
}

const TrainSchema = SchemaFactory.createForClass(Train);
export const TrainModel = MongooseModule.forFeature([{ name: Train.name, schema: TrainSchema }]);

// Add indexes for better query performance
TrainSchema.index({ type: 1, status: 1 });
TrainSchema.index({ status: 1 });
