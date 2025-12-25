import { Module } from '@nestjs/common';
import { CounterModel, TicketModel } from './schema';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { ScheduleModel } from '../schedules/schema/schedule.schema';
import { RouteModel } from '../routes/schema/route.schema';
import { TrainModel } from '../train/schema/train.schema';

@Module({
  imports: [TicketModel, CounterModel, ScheduleModel, RouteModel, TrainModel],
  controllers: [TicketController],
  providers: [TicketService]
})
export class TicketModule {}
