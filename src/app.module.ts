import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { TripModule } from './modules/trip/trip.module';
import { TrainModule } from './modules/train/train.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { StationsModule } from './modules/stations/stations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/egyptian-railways'),
    AuthModule,
    TicketModule,
    TripModule,
    TrainModule,
    SchedulesModule,
    StationsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
