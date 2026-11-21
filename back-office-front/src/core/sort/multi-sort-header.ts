import {
  ComponentRef,
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { MultiSort } from './multi-sort';
import { MatIcon } from '@angular/material/icon';

@Directive({
  selector: 'th[multiSortHeader]',
  host: {
    class: 'multi-sort-header',
    '[class.is-sorted]': 'sortState() !== null',
    '[attr.data-sort-field]': 'resolvedField()',
    '(click)': 'onHeaderClick()',
  },
})
export class MultiSortHeader {
  /** Nom del camp pel qual ordenar (si no es passa, agafa el de matColumnDef) */
  readonly field = input<string>('', { alias: 'multiSortHeader' });
  readonly icon = input('');
  readonly #multiSort = inject(MultiSort);
  readonly #el = inject<ElementRef<HTMLTableCellElement>>(ElementRef);
  protected readonly resolvedField = computed(() => {
    if (this.field()) return this.field();
    const colClass = Array.from(this.#el.nativeElement.classList).find((c) =>
      c.startsWith('mat-column-'),
    );
    return colClass ? colClass.replace('mat-column-', '') : '';
  });
  protected readonly sortState = computed(() => this.#multiSort.getSortState(this.resolvedField()));
  readonly #renderer = inject(Renderer2);
  readonly #vcr = inject(ViewContainerRef);
  #indicatorEl: HTMLElement | null = null;
  #iconRef: ComponentRef<MatIcon> | null = null;
  #badgeEl: HTMLElement | null = null;
  readonly #destroy = inject(DestroyRef).onDestroy(() => {
    this.#iconRef?.destroy();
    this.#indicatorEl?.remove();
  });

  readonly #renderEffect = effect(() => {
    const state = this.sortState();
    this.#ensureIndicatorDOM();

    const iconEl = this.#iconRef?.location.nativeElement as HTMLElement | undefined;

    if (!state) {
      this.#renderer.setStyle(this.#indicatorEl, 'opacity', '0');
      if (iconEl) this.#renderer.removeClass(iconEl, 'desc');
      if (this.#badgeEl) this.#badgeEl.textContent = '';
    } else {
      this.#renderer.setStyle(this.#indicatorEl, 'opacity', '1');
      if (iconEl) {
        if (state.direction === 'DESC') {
          this.#renderer.addClass(iconEl, 'desc');
        } else {
          this.#renderer.removeClass(iconEl, 'desc');
        }
      }
      if (this.#badgeEl) {
        this.#badgeEl.textContent = String(state.order);
      }
    }
  });

  protected onHeaderClick(): void {
    const fieldName = this.resolvedField();
    if (fieldName) {
      this.#multiSort.toggle(fieldName);
    }
  }

  #ensureIndicatorDOM(): void {
    if (this.#indicatorEl) return;

    const th = this.#el.nativeElement;

    const wrapper = this.#renderer.createElement('div');
    this.#renderer.addClass(wrapper, 'multi-sort-container');

    while (th.firstChild) {
      this.#renderer.appendChild(wrapper, th.firstChild);
    }

    this.#indicatorEl = this.#renderer.createElement('span');
    this.#renderer.addClass(this.#indicatorEl, 'multi-sort-indicator');

    // Creem el component <mat-icon>arrow_upward</mat-icon> dinàmicament
    this.#iconRef = this.#vcr.createComponent(MatIcon);
    const iconEl = this.#iconRef.location.nativeElement as HTMLElement;
    this.#renderer.addClass(iconEl, 'multi-sort-arrow');
    this.#renderer.appendChild(iconEl, this.#renderer.createText('arrow_upward'));

    this.#badgeEl = this.#renderer.createElement('span');
    this.#renderer.addClass(this.#badgeEl, 'multi-sort-badge');

    this.#renderer.appendChild(this.#indicatorEl, iconEl);
    this.#renderer.appendChild(this.#indicatorEl, this.#badgeEl);
    this.#renderer.appendChild(wrapper, this.#indicatorEl);
    this.#renderer.appendChild(th, wrapper);
  }
}
