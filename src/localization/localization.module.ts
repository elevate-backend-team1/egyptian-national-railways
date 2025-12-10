import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LocalizationService } from './localization.service';
import { LocalizationInterceptor } from './localization.interceptor';


@Module({
  providers: [
    LocalizationService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LocalizationInterceptor, // نخليه Global Interceptor
    },
  ],
  exports: [LocalizationService],
})
export class LocalizationModule {}
