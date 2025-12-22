import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export interface IRouteStop {
  stationId: Types.ObjectId;
  arrivalTime: String;
  departureTime: String;
  stopOrder: Number;
  distanceFromStart: Number;
}

export type RouteDocument = Route & Document;

@Schema({ timestamps: true })
export class Route {
  @Prop({ type: Types.ObjectId, ref: 'Train', required: true })
  trainId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  routeName: string;

  @Prop({ type: Types.ObjectId, ref: 'Station', required: true })
  startStationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Station', required: true })
  endStationId: Types.ObjectId;

  @Prop({ required: true })
  stops: IRouteStop[];

  @Prop({ required: true })
  totalDuration: number; // Total duration of the route in minutes

  @Prop({ required: true })
  totalDistance: number; // Total distance of the route in kilometers
}

const RouteSchema = SchemaFactory.createForClass(Route);
export const RouteModel = MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]);
