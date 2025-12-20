import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { CompanionModule } from './modules/companion/companion.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { TripModule } from './trip/trip.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL || 'mongodb://localhost/railways'),
    AuthModule,
    TicketModule,
    CompanionModule,
    OnboardingModule,
    TripModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
