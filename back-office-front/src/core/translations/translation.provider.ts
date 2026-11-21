import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { TranslationService } from './translation-service';
import { Observable } from 'rxjs';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslationTitleStrategy } from './translation-title-strategy';
import { TranslationKey } from './translation-keys.type';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorIntl } from './paginator-intl';

export type TranslationLoader = (lang: string) => Observable<Record<string, string>>;

export function provideTranslation(config: {
  language: string;
  loader: () => TranslationLoader;
  titleStrategy?: (snapshot: RouterStateSnapshot) => TranslationKey;
}): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: TranslationService,
      useFactory: () => new TranslationService(config.language, config.loader()),
    },
    {
      provide: TitleStrategy,
      useFactory: () => new TranslationTitleStrategy(config.titleStrategy),
    },
    {
      provide: MatPaginatorIntl,
      useClass: PaginatorIntl,
    },
  ]);
}
