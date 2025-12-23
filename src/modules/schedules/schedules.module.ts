import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TrainModel } from '../train/schema/train.schema';
import { RouteModel } from '../routes/schema/route.schema';
import { ScheduleModel } from './schema/schedule.schema';

@Module({
  controllers: [SchedulesController],
  providers: [SchedulesService],
  imports: [TrainModel, RouteModel, ScheduleModel]
})
export class SchedulesModule {}
