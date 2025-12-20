import { Module } from '@nestjs/common';
import { CompanionController } from './companion.controller';
import { CompanionService } from './companion.service';
import { companionModel } from './schemas/companion.schema';

@Module({
  imports: [companionModel],
  controllers: [CompanionController],
  providers: [CompanionService],
  exports: []
})
export class CompanionModule {}
