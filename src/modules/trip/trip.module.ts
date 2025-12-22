import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TripModel } from './schema/trip.schema';
import { TrainModel } from '../train/schema/train.schema';

@Module({
  controllers: [TripController],
  providers: [TripService],
  imports: [TripModel, TrainModel]
})
export class TripModule {}
