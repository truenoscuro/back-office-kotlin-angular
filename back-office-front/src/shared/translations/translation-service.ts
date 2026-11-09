import { ResourceRef, Signal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { TranslationKey } from './translation-keys.type';

export class TranslationService {
  #tag = signal<string>('');
  #dictionary: ResourceRef<Record<string, string>>;

  constructor(
    tag: string,
    translationObs: (language: string) => Observable<Record<string, string>>,
  ) {
    this.#tag.set(tag);
    this.#dictionary = rxResource({
      params: this.#tag,
      stream: ({ params }) =>
        translationObs(params).pipe(
          map((dictionary) =>
            Object.fromEntries(
              Object.entries(dictionary).map(([key, value]) => [key.trim().toUpperCase(), value]),
            ),
          ),
        ),
      defaultValue: {} as Record<string, string>,
    });
  }

  public get language(): Signal<string> {
    return this.#tag.asReadonly();
  }

  public set language(value: string) {
    this.#tag.set(value);
  }

  public get isLoading() {
    return this.#dictionary.isLoading;
  }

  public get dictionary() {
    return this.#dictionary.value.asReadonly();
  }

  public translate(key: TranslationKey): string {
    const translate = this.#dictionary.value()[key] ?? key;
    if (translate === key) {
      console.warn('MISSING TRANSLATION', key);
    }

    return translate;
  }
}
