import { Types } from 'mongoose';

export interface IRouteStop {
  stationId: Types.ObjectId;
  arrivalTime: string;
  departureTime: string;
  stopOrder: number;
  distanceFromStart: number;
}
