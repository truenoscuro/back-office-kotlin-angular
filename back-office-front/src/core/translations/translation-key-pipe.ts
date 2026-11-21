import { inject, Pipe, PipeTransform } from '@angular/core';
import { isTranslationKey } from './translation-keys.type';
import { TranslationService } from './translation-service';

@Pipe({
  name: 'translationString',
  pure: false,
})
export class TranslationStringPipe implements PipeTransform {
  #translationService = inject(TranslationService);

  transform(value?: string): String {
    if (value === undefined) return '';
    if (!isTranslationKey(value)) {
      console.warn('Invalid translation key: ' + value);
      return value;
    }
    return this.#translationService.translate(value);
  }
}
