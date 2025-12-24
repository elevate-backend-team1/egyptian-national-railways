import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card, CardDocument } from './schemas/card.schema';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class PaymentService {
  constructor(@InjectModel(Card.name) private readonly cardModel: Model<CardDocument>) {}

  async addCard(userId: string, dto: CreateCardDto) {
    const card = await this.cardModel.create({
      userId,
      ...dto
    });
    return card;
  }

  async listCards(userId: string) {
    return this.cardModel.find({ userId }).lean();
  }
}
