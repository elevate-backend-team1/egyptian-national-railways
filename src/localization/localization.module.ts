import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LocalizationInterceptor } from './localization.interceptor';
import { LocalizationService } from './localization.service';

@Module({
  providers: [
    LocalizationService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LocalizationInterceptor
    }
  ],
  exports: [LocalizationService]
})
export class LocalizationModule {}
