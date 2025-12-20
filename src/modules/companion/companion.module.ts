import { Module } from '@nestjs/common';
import { CompanionController } from './companion.controller';

@Module({
  imports: [],
  controllers: [CompanionController],
  providers: [],
  exports: []
})
export class CompanionModule {}
