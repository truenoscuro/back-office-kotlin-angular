import { Pipe, PipeTransform } from '@angular/core';
import { isTranslationKey, TranslationKey } from './translation-keys.type';

@Pipe({
  name: 'translationKey',
})
export class TranslationKeyPipe implements PipeTransform {
  transform(value?: string): TranslationKey | undefined {
    if (value === undefined) return undefined;
    if (!isTranslationKey(value)) {
      console.warn('Invalid translation key: ' + value);
      return undefined;
    }
    return value;
  }
}
