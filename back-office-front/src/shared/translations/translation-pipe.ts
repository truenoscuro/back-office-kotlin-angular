import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './translation-service';
import { isTranslationKey, TranslationKey } from './translation-keys.type';

@Pipe({
  name: 'translation',
  pure: false,
})
export class TranslationPipe implements PipeTransform {
  #translationService = inject(TranslationService);

  transform(value?: TranslationKey): string {

    if (!value) {
      console.warn('No translation key provided');
      return '';
    }

    return this.#translationService.translate(value);
  }
}
