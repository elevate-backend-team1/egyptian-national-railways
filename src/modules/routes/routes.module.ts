import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { RouteModel } from './schema/route.schema';
import { TrainModel } from '../train/schema/train.schema';

@Module({
  controllers: [RoutesController],
  providers: [RoutesService],
  imports: [RouteModel, TrainModel]
})
export class RoutesModule {}
