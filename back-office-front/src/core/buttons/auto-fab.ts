import {
  ComponentRef,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  inputBinding,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { AppContext } from '../app-context/app-context';
import { MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  // 1. Acceptem tant <button> com <a>
  selector: 'button[matButton][autoFab], a[matButton][autoFab]',
})
export class AutoFab {
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

    if (isMobile) {
      if (this.#fabRef) {
        this.#restoreOriginalButton();
      }
      this.#switchToFab();
    } else {
      this.#restoreOriginalButton();
    }
  });

  #switchToFab(): void {
    const nativeEl = this.#element.nativeElement;
    const labelSpan = nativeEl.querySelector('.mdc-button__label');
    const iconEl = nativeEl.querySelector('mat-icon');

    this.#savedNodes = [];
    if (iconEl) {
      this.#savedNodes.push(iconEl);
    }
    if (labelSpan) {
      this.#savedNodes.push(...Array.from(labelSpan.childNodes));
    }

    this.#renderer.setStyle(nativeEl, 'display', 'none');

    this.#fabRef = this.#container.createComponent(MatFabButton, {
      projectableNodes: [this.#savedNodes],
      // Si el botó original té matTooltip, el muntem directament al nou FAB
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
    });
    this.#fabRef.setInput('extended', true);

    const fabEl = this.#fabRef.location.nativeElement;

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

    // 3. En fer clic al FAB, disparem .click() sobre el <a> original:
    // això activa automàticament la directiva [routerLink] o el href natiu!
    this.#removeClickListener = this.#renderer.listen(fabEl, 'click', (e: MouseEvent) => {
      e.stopPropagation();
      nativeEl.click();
    });
  }

  #restoreOriginalButton(): void {
    if (!this.#fabRef) return;

    const nativeEl = this.#element.nativeElement;
    const labelSpan = nativeEl.querySelector('.mdc-button__label');

    for (const node of this.#savedNodes) {
      if (node.nodeName.toLowerCase() === 'mat-icon' && labelSpan) {
        this.#renderer.insertBefore(nativeEl, node, labelSpan);
      } else if (labelSpan) {
        this.#renderer.appendChild(labelSpan, node);
      } else {
        this.#renderer.appendChild(nativeEl, node);
      }
    }
    this.#savedNodes = [];

    this.#cleanup();
    this.#renderer.removeStyle(nativeEl, 'display');
  }

  #syncProperties(source: HTMLButtonElement | HTMLAnchorElement, target: HTMLButtonElement): void {
    // 4. Gestió unificada de disabled (els <a> no tenen propietat .disabled nativa, usen aria-disabled o atribut)
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

    // 3. Classes personalitzades (filtrant les internes d'Angular Material / MDC / CDK)
    const userClasses = Array.from(source.classList).filter(
      (cls) => !cls.startsWith('mat-') && !cls.startsWith('mdc-') && !cls.startsWith('cdk-'),
    );

    // Afegim les noves classes d'usuari
    for (const cls of userClasses) {
      if (!this.#syncedClasses.has(cls)) {
        this.#renderer.addClass(target, cls);
        this.#syncedClasses.add(cls);
      }
    }

    // Eliminem les que s'hagin tret dinàmicament (p. ex. amb [class.active]="...")
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
