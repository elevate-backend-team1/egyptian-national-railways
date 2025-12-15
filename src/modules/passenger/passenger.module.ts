// src/passengers/passengers.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassengersService } from './passenger.service';
import { PassengersController } from './passenger.controller';
import { Passenger, PassengerSchema } from './schemas/passenger.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Passenger.name, schema: PassengerSchema },
    ]),
  ],
  controllers: [PassengersController],
  providers: [PassengersService],
})
export class PassengersModule {}
