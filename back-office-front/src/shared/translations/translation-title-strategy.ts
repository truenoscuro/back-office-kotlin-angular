import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslationService } from './translation-service';
import { TranslationKey } from './translation-keys.type';

export class TranslationTitleStrategy extends TitleStrategy {
  #title = inject(Title);
  #currentTitle = signal<TranslationKey | ''>('');
  #translationService = inject(TranslationService);
  #generateTitle: (snapshot: RouterStateSnapshot) => TranslationKey;
  #changeLanguage = effect(() => {
    this.#translationService.language();
    const title = this.#currentTitle();
    if (title) this.#title.setTitle(this.#translationService.translate(title));
  });

  constructor(generateTitle: (snapshot: RouterStateSnapshot) => TranslationKey) {
    super();
    this.#generateTitle = generateTitle;
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.#generateTitle(snapshot);
    this.#currentTitle.set(title);
  }
}
