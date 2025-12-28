import { Module } from '@nestjs/common';
import { FAQsController } from './FAQs.controller';
import { FAQsService } from './FAQS.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FAQsSchema } from './schema/FAQs.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'FAQ', schema: FAQsSchema }])],
  controllers: [FAQsController],
  providers: [FAQsService],
  exports: []
})
export class FAQsModule {}
