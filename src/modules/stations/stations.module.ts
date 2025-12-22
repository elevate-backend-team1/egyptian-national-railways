import { Module } from '@nestjs/common';
import { StationsService } from './stations.service';
import { StationsController } from './stations.controller';
import { StationModel } from './schema/stations.schema';

@Module({
  controllers: [StationsController],
  providers: [StationsService],
  imports: [StationModel]
})
export class StationsModule {}
