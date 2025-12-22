import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Route {
  @Prop({ type: Types.ObjectId, ref: 'Train', required: true })
  train_id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  route_code: string;

  @Prop({ type: Types.ObjectId, ref: 'Station', required: true })
  start_station_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Station', required: true })
  end_station_id: Types.ObjectId;

  @Prop({
    type: [
      {
        station_id: { type: Types.ObjectId, ref: 'Station' },
        arrival_time: String,
        departure_time: String,
        order: Number,
        distance_from_start: Number
      }
    ]
  })
  station_list: any[];

  @Prop({ required: true })
  total_duration_minutes: number;
}

export type RouteDocument = Route & Document;
export const RouteSchema = SchemaFactory.createForClass(Route);
