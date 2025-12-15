import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
<<<<<<< HEAD
import { LocalizationModule } from './localization/localization.module';
=======
import { TicketModule } from './modules/ticket/ticket.module';
>>>>>>> 31244b186ef00bd1878f660a4a675fbe0b955ea4

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/egyptian-railways'),
    AuthModule,
<<<<<<< HEAD
    LocalizationModule
=======
    TicketModule
>>>>>>> 31244b186ef00bd1878f660a4a675fbe0b955ea4
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
