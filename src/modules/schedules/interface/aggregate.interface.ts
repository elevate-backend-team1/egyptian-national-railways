import { Types } from 'mongoose';

export interface AggregatedRoute {
  _id: Types.ObjectId;
  fromStationStopOrder: number;
  toStationStopOrder: number;
}
