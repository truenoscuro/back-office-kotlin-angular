import { Component, computed, inject } from '@angular/core';
import { KeyRouter } from '../../core/router/key-router';
import { TranslationStringPipe } from '../../core/translations/translation-key-pipe';
import { KeyRouterLink } from '../../core/router/key-router-link';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [TranslationStringPipe, KeyRouterLink],
  selector: 'app-header-screen',
  styleUrl: './header-screen.scss',
  templateUrl: './header-screen.html',
})
export class HeaderScreen {
  #keyRouter = inject(KeyRouter);
  #activeRouter = inject(ActivatedRoute);
  screen = computed(() => this.#keyRouter.getScreenRoute(this.#activeRouter));
}
