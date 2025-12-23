import { Module } from '@nestjs/common';
import { TrainService } from './train.service';
import { TrainController } from './train.controller';
import { TrainModel } from './schema/train.schema';

@Module({
  controllers: [TrainController],
  providers: [TrainService],
  imports: [TrainModel]
})
export class TrainModule {}
