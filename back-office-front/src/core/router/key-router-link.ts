import { computed, Directive, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScreenKey } from './screen-keys.type';
import { KeyRouter } from './key-router';

@Directive({
  selector: '[keyRouterLink]',
  hostDirectives: [RouterLink],
})
export class KeyRouterLink {
  key = input.required<ScreenKey>({ alias: 'keyRouterLink' });
  params = input<(string | number)[]>([]);
  #routerLink = inject(RouterLink);
  #keyRouter = inject(KeyRouter);
  path = computed(() => this.#keyRouter.getPath(this.key(), this.params()));

  //Añadimos el path al router link
  #navigate = effect(() => {
    this.#routerLink.routerLink = this.path();
  });
}
