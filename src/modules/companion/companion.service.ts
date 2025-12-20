import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CompanionDocument } from './schemas/companion.schema';
import { Model } from 'mongoose';
import { AddCompanionDto } from './dto/add-companion.dto';

@Injectable()
export class CompanionService {
  constructor(
    @InjectModel('Companion')
    private readonly companionModel: Model<CompanionDocument>
  ) {}

  async createCompanion(companion: AddCompanionDto, userId: string): Promise<CompanionDocument> {
    return this.companionModel.create({ ...companion, owner_user_id: userId });
  }

  async getCompanionsByUserId(userId: string): Promise<CompanionDocument[]> {
    return this.companionModel.find({ owner_user_id: userId });
  }

  async getCompanionById(companionId: string): Promise<CompanionDocument | null> {
    return this.companionModel.findById(companionId);
  }

  async deleteCompanion(companionId: string): Promise<CompanionDocument | null> {
    return this.companionModel.findByIdAndDelete(companionId);
  }

  async updateCompanion(companionId: string, updateData: Partial<AddCompanionDto>): Promise<CompanionDocument | null> {
    return this.companionModel.findByIdAndUpdate(companionId, updateData, { new: true });
  }
}
