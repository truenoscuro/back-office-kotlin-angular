import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { PermissionKey } from './permission-keys.type';
import { Authority } from './authority';

@Directive({
  selector: '[hasAuthority]',
})
export class HasAuthority {
  #element = inject<ElementRef<HTMLElement>>(ElementRef);
  #authority = inject(Authority);

  //Copiamos el display por defecto que tiene
  constructor() {
    const display = this.#element.nativeElement.style.display;
    effect(() => {
      const permissions = this.permissions();
      const haveAllPermissions = this.#authority.haveAllPermissions(permissions);
      //Escondemos el display
      if (haveAllPermissions) {
        this.#element.nativeElement.style.display = display;
      } else {
        this.#element.nativeElement.style.display = 'none';
      }
    });
  }

  #stringTransform = (value: PermissionKey) => [value];

  permissions = input.required({ transform: this.#stringTransform });
}
