import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CompanionDocument } from './schemas/companion.schema';
import { Model } from 'mongoose';

@Injectable()
export class CompanionService {
  constructor(
    @InjectModel('Companion')
    private readonly companionModel: Model<CompanionDocument>
  ) {}

  async createCompanion(companion: CompanionDocument): Promise<CompanionDocument> {
    return this.companionModel.create(companion);
  }
}
