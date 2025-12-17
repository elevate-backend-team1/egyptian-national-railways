import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TripModel } from './schema/trip.schema';

@Module({
  controllers: [TripController],
  providers: [TripService],
  imports: [TripModel]
})
export class TripModule {}
