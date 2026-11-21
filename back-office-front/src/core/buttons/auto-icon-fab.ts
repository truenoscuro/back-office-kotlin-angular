import {
  ComponentRef,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  inputBinding,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { AppContext } from '../app-context/app-context';
import { MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

export type AutoIconFabMode = 'fab' | 'mini';

@Directive({
  selector: 'button[matIconButton][autoIconFab], a[matIconButton][autoIconFab]',
})
export class AutoIconFab {
  readonly mode = input<AutoIconFabMode, AutoIconFabMode | ''>('fab', {
    alias: 'autoIconFab',
    transform: (value) => (value === '' ? 'fab' : value),
  });

  readonly #appContext = inject(AppContext);
  readonly #element = inject<ElementRef<HTMLButtonElement | HTMLAnchorElement>>(ElementRef);
  readonly #container = inject(ViewContainerRef);
  readonly #renderer = inject(Renderer2);
  readonly #tooltip = inject(MatTooltip, { optional: true, self: true });
  #savedNodes: Node[] = [];
  #mutationObserver: MutationObserver | null = null;
  #removeClickListener: (() => void) | null = null;
  #fabRef: ComponentRef<MatFabButton | MatMiniFabButton> | null = null;

  readonly #destroyEvent = inject(DestroyRef).onDestroy(() => this.#cleanup());
  #syncedClasses = new Set<string>();

  readonly #changeButton = effect(() => {
    const isMobile = this.#appContext.isMobile();
    const currentMode = this.mode();

    if (isMobile) {
      if (this.#fabRef) {
        this.#restoreOriginalButton();
      }
      this.#switchToFab(currentMode);
    } else {
      this.#restoreOriginalButton();
    }
  });

  #switchToFab(mode: AutoIconFabMode): void {
    const nativeEl = this.#element.nativeElement;
    const iconEl = nativeEl.querySelector('mat-icon');

    // En matIconButton el <mat-icon> és fill directe (no hi ha .mdc-button__label)
    this.#savedNodes = iconEl ? [iconEl] : [];

    this.#renderer.setStyle(nativeEl, 'display', 'none');

    const options = {
      projectableNodes: [this.#savedNodes],
      directives: this.#tooltip
        ? [
            {
              type: MatTooltip,
              bindings: [
                inputBinding('matTooltip', () => this.#tooltip!.message),
                inputBinding('matTooltipPosition', () => this.#tooltip!.position),
                inputBinding('matTooltipDisabled', () => this.#tooltip!.disabled),
                inputBinding('matTooltipShowDelay', () => this.#tooltip!.showDelay),
                inputBinding('matTooltipHideDelay', () => this.#tooltip!.hideDelay),
                inputBinding('matTooltipTouchGestures', () => this.#tooltip!.touchGestures),
              ],
            },
          ]
        : [],
    };
    this.#fabRef =
      mode === 'mini'
        ? this.#container.createComponent(MatMiniFabButton, options)
        : this.#container.createComponent(MatFabButton, options);

    const fabEl = this.#fabRef.location.nativeElement as HTMLButtonElement;

    this.#syncProperties(nativeEl, fabEl);
    this.#mutationObserver = new MutationObserver(() => this.#syncProperties(nativeEl, fabEl));
    this.#mutationObserver.observe(nativeEl, {
      attributes: true,
      attributeFilter: [
        'disabled',
        'aria-disabled',
        'aria-label',
        'title',
        'href',
        'target',
        'class',
      ],
    });

    this.#removeClickListener = this.#renderer.listen(fabEl, 'click', (e: MouseEvent) => {
      e.stopPropagation();
      nativeEl.click();
    });
  }

  #restoreOriginalButton(): void {
    if (!this.#fabRef) return;

    const nativeEl = this.#element.nativeElement;

    // Tornem el <mat-icon> dins el <button matIconButton> abans de destruir el FAB
    for (const node of this.#savedNodes) {
      this.#renderer.appendChild(nativeEl, node);
    }
    this.#savedNodes = [];

    this.#cleanup();
    this.#renderer.removeStyle(nativeEl, 'display');
  }

  #syncProperties(source: HTMLButtonElement | HTMLAnchorElement, target: HTMLButtonElement): void {
    if (source instanceof HTMLButtonElement) {
      target.disabled = source.disabled;
      target.type = source.type;
    } else {
      target.disabled =
        source.hasAttribute('disabled') || source.getAttribute('aria-disabled') === 'true';
    }

    const ariaLabel = source.getAttribute('aria-label');
    if (ariaLabel) {
      target.setAttribute('aria-label', ariaLabel);
    } else {
      target.removeAttribute('aria-label');
    }

    const userClasses = Array.from(source.classList).filter(
      (cls) => !cls.startsWith('mat-') && !cls.startsWith('mdc-') && !cls.startsWith('cdk-'),
    );

    for (const cls of userClasses) {
      if (!this.#syncedClasses.has(cls)) {
        this.#renderer.addClass(target, cls);
        this.#syncedClasses.add(cls);
      }
    }

    for (const cls of this.#syncedClasses) {
      if (!userClasses.includes(cls)) {
        this.#renderer.removeClass(target, cls);
        this.#syncedClasses.delete(cls);
      }
    }
  }

  #cleanup(): void {
    this.#mutationObserver?.disconnect();
    this.#mutationObserver = null;
    this.#removeClickListener?.();
    this.#removeClickListener = null;
    this.#fabRef?.destroy();
    this.#fabRef = null;
  }
}
