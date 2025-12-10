import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LocalizationService, SupportedLanguage } from './localization.service';

export interface LocalizedRequest extends Request {
  lang?: SupportedLanguage;
}

@Injectable()
export class LocalizationInterceptor implements NestInterceptor {
  constructor(private readonly localizationService: LocalizationService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest<LocalizedRequest>();

    const acceptLang = request.headers['accept-language'] as string | undefined;

    const lang = this.localizationService.normalizeLanguage(acceptLang);

    request.lang = lang;

    const response = httpCtx.getResponse();
    response.setHeader('Content-Language', lang);

    return next.handle();
  }
}
