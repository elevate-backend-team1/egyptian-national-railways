import { Types } from 'mongoose';

export interface RouteStation {
  station_id: Types.ObjectId;
  arrival_time: string;
  departure_time: string;
  order: number;
  distance_from_start: number;
}
