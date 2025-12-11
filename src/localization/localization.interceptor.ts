import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response, Request } from 'express';
import { LocalizationService, SupportedLanguage } from './localization.service';

@Injectable()
export class LocalizationInterceptor implements NestInterceptor {
  constructor(private readonly localizationService: LocalizationService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest<Request & { lang?: SupportedLanguage }>();
    const response = httpCtx.getResponse<Response>();

    const acceptLang = request.headers['accept-language'];
    const lang = this.localizationService.normalizeLanguage(acceptLang);

    request.lang = lang;
    response.setHeader('Content-Language', lang);

    return next.handle();
  }
}
