import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/egyptian-railways'), AuthModule, UsersModule, MailModule,],
  controllers: [AppController],
  providers: [AppService],
})




export class AppModule {}
