import { Injectable } from '@nestjs/common';

export type SupportedLanguage = 'en' | 'ar';

@Injectable()
export class LocalizationService {
  private readonly defaultLang: SupportedLanguage = 'en';
  private readonly supported: SupportedLanguage[] = ['en', 'ar'];

  getDefaultLanguage(): SupportedLanguage {
    return this.defaultLang;
  }

  normalizeLanguage(lang?: string): SupportedLanguage {
    if (!lang) return this.defaultLang;

    const short = lang.toLowerCase().split('-')[0] as SupportedLanguage;
    if (this.supported.includes(short)) return short;

    return this.defaultLang;
  }
}
