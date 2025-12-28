import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FAQs } from './schema/FAQs.schema';
import { Model } from 'mongoose';
import { UpdateFAQsDto } from './dto/update-FAqs.dto';
import { CreateFAQsDto } from './dto/create-FAQs.dto';

@Injectable()
export class FAQsService {
  constructor(@InjectModel('FAQ') private readonly faqModel: Model<FAQs>) {}

  async createFAQ(faq: CreateFAQsDto): Promise<FAQs> {
    const createdFAQ = new this.faqModel(faq);
    return createdFAQ.save();
  }

  async getAllFAQs(): Promise<FAQs[]> {
    return this.faqModel.find().exec();
  }

  async getFAQById(id: string): Promise<FAQs | null> {
    return this.faqModel.findById(id).exec();
  }

  async updateFAQ(id: string, faq: UpdateFAQsDto): Promise<FAQs | null> {
    return this.faqModel.findByIdAndUpdate(id, faq, { new: true }).exec();
  }

  async deleteFAQ(id: string): Promise<FAQs | null> {
    return this.faqModel.findByIdAndDelete(id).exec();
  }
}
