import { Module } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { ContactUsController } from './contact-us.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactUsSchema } from './schema/contact-us.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'ContactUs', schema: ContactUsSchema }])],
  controllers: [ContactUsController],
  providers: [ContactUsService]
})
export class ContactUsModule {}
