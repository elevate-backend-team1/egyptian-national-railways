// src/modules/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from './schemas/card.schema';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }])],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
