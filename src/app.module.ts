import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { LocalizationModule } from './localization/localization.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { TripModule } from './trip/trip.module';
import { PassengersModule } from './modules/passenger/passenger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL || 'mongodb://localhost/railways'),
    AuthModule,
    LocalizationModule,
    TicketModule,
    TripModule,
    TicketModule,
    PassengersModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
