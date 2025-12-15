import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CounterDocument = HydratedDocument<Counter>;

@Schema({ timestamps: true })
export class Counter {
  @Prop({
    required: true,
    unique: true
  })
  name: string;

  @Prop({
    default: 0
  })
  value: number;
}

const CounterSchema = SchemaFactory.createForClass(Counter);
export const CounterModel = MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }]);
