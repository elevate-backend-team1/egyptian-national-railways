import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IRouteStop } from '../interface/route-station.interface';

export type RouteDocument = HydratedDocument<Route>;

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
  staionLists: IRouteStop[];

  @Prop({ required: true })
  totalDuration: number; // Total duration of the route in minutes

  @Prop({ required: true })
  totalDistance: number; // Total distance of the route in kilometers
}

const RouteSchema = SchemaFactory.createForClass(Route);
export const RouteModel = MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]);
