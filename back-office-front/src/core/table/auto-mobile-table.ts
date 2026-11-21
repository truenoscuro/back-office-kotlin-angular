import {
  ComponentRef,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { AppContext } from '../app-context/app-context';
import { MultiSort } from '../sort/multi-sort';
import { MatIcon } from '@angular/material/icon';

const CELL_SELECTOR = 'th[mat-header-cell], td[mat-cell], td[mat-footer-cell]';

interface SortableColumnMeta {
  field: string;
  label: string;
}
interface MobileSortButtonRef {
  btn: HTMLButtonElement;
  badge: HTMLSpanElement;
  iconRef: ComponentRef<MatIcon>;
  orderSpan: HTMLSpanElement;
}
@Directive({
  selector: 'table[mat-table][autoMobileTable]',
  host: {
    '[class.mobile-card-table]': 'isMobile()',
  },
})
export class AutoMobileTable {
  /** Nom opcional de la columna d'accions (per defecte 'actions') */
  readonly actionsColumn = input<string>('actions');
  /** Mapa d'amplades per nom de columna, ex: { value: '15%', label: '70%', actions: '15%' } */
  readonly columnWidths = input<Record<string, string>>({});

  readonly #appContext = inject(AppContext);
  protected readonly isMobile = this.#appContext.isMobile;
  readonly #element = inject<ElementRef<HTMLTableElement>>(ElementRef);
  readonly #renderer = inject(Renderer2);
  readonly #multiSort = inject(MultiSort, { optional: true });
  readonly #vcr = inject(ViewContainerRef);
  #observer: MutationObserver | null = null;
  #sortToolbarEl: HTMLElement | null = null;
  readonly #sortButtons = new Map<string, MobileSortButtonRef>();

  readonly #destroy = inject(DestroyRef).onDestroy(() => {
    this.#observer?.disconnect();
    this.#removeMobileSortToolbar();
  });

  // Sincronitza l'estat visual dels botons mòbils quan canvien els sorts
  readonly #syncSortStateEffect = effect(() => {
    if (!this.#multiSort || !this.isMobile()) return;

    const activeSorts = this.#multiSort.sorts();
    this.#updateMobileSortButtons(activeSorts);
  });

  // Sincronitza el mode desktop/mòbil, amplades, etiquetes i barra de sort
  readonly #syncEffect = effect(() => {
    const mobile = this.isMobile();
    const widths = this.columnWidths();

    this.#syncTableState(mobile, widths);
    this.#startObserving();
  });

  #syncTableState(mobile: boolean, widths: Record<string, string>): void {
    if (mobile) {
      this.#clearDesktopWidths();
      this.#applyLabels();
      this.#ensureMobileSortToolbar();
    } else {
      this.#removeMobileSortToolbar();
      this.#applyDesktopWidths(widths);
    }
  }

  #ensureMobileSortToolbar(): void {
    if (!this.#multiSort || this.#sortToolbarEl) return;

    const table = this.#element.nativeElement;
    const parent = table.parentElement;
    if (!parent) return;

    const sortableHeaders = table.querySelectorAll<HTMLTableCellElement>(
      'thead th[data-sort-field]',
    );
    if (sortableHeaders.length === 0) return;

    const columns: SortableColumnMeta[] = [];
    sortableHeaders.forEach((th) => {
      const field = th.getAttribute('data-sort-field');
      if (!field) return;

      const clone = th.cloneNode(true) as HTMLElement;
      clone.querySelector('.multi-sort-indicator')?.remove();
      const label = clone.textContent?.trim() || field;

      columns.push({ field, label });
    });

    if (columns.length === 0) return;

    const toolbar = this.#renderer.createElement('div') as HTMLElement;
    this.#renderer.addClass(toolbar, 'mobile-sort-toolbar');

    columns.forEach(({ field, label }) => {
      const btn = this.#renderer.createElement('button') as HTMLButtonElement;
      this.#renderer.setAttribute(btn, 'type', 'button');
      this.#renderer.addClass(btn, 'mobile-sort-chip');

      const labelSpan = this.#renderer.createElement('span');
      labelSpan.textContent = label;

      // Contenidor del badge (icona + número d'ordre)
      const badgeSpan = this.#renderer.createElement('span') as HTMLSpanElement;
      this.#renderer.addClass(badgeSpan, 'mobile-sort-chip-badge');

      // Creem el <mat-icon>arrow_upward</mat-icon> igual que a desktop
      const iconRef = this.#vcr.createComponent(MatIcon);
      const iconEl = iconRef.location.nativeElement as HTMLElement;
      this.#renderer.addClass(iconEl, 'mobile-sort-arrow');
      this.#renderer.appendChild(iconEl, this.#renderer.createText('arrow_upward'));

      const orderSpan = this.#renderer.createElement('span') as HTMLSpanElement;

      this.#renderer.appendChild(badgeSpan, iconEl);
      this.#renderer.appendChild(badgeSpan, orderSpan);

      this.#renderer.appendChild(btn, labelSpan);
      this.#renderer.appendChild(btn, badgeSpan);

      this.#renderer.listen(btn, 'click', () => {
        this.#multiSort?.toggle(field);
      });

      this.#sortButtons.set(field, { btn, badge: badgeSpan, iconRef, orderSpan });
      this.#renderer.appendChild(toolbar, btn);
    });

    this.#renderer.insertBefore(parent, toolbar, table);
    this.#sortToolbarEl = toolbar;

    this.#updateMobileSortButtons(this.#multiSort.sorts());
  }

  #updateMobileSortButtons(activeSorts: readonly { field: string; direction: string }[]): void {
    this.#sortButtons.forEach(({ btn, badge, iconRef, orderSpan }, field) => {
      const index = activeSorts.findIndex((s) => s.field === field);
      const iconEl = iconRef.location.nativeElement as HTMLElement;

      if (index === -1) {
        this.#renderer.removeClass(btn, 'is-active');
        this.#renderer.setStyle(badge, 'display', 'none');
        this.#renderer.removeClass(iconEl, 'desc');
        orderSpan.textContent = '';
      } else {
        this.#renderer.addClass(btn, 'is-active');
        this.#renderer.setStyle(badge, 'display', 'inline-flex');
        if (activeSorts[index].direction === 'DESC') {
          this.#renderer.addClass(iconEl, 'desc');
        } else {
          this.#renderer.removeClass(iconEl, 'desc');
        }
        orderSpan.textContent = String(index + 1);
      }
    });
  }

  #removeMobileSortToolbar(): void {
    this.#sortButtons.forEach(({ iconRef }) => iconRef.destroy());
    this.#sortButtons.clear();
    this.#sortToolbarEl?.remove();
    this.#sortToolbarEl = null;
  }

  #startObserving(): void {
    if (this.#observer) return;

    const table = this.#element.nativeElement;
    this.#observer = new MutationObserver(() => {
      this.#syncTableState(this.isMobile(), this.columnWidths());
    });
    this.#observer.observe(table, {
      childList: true,
      subtree: true,
    });
  }

  #applyDesktopWidths(widths: Record<string, string>): void {
    const entries = Object.entries(widths);
    if (entries.length === 0) {
      this.#clearDesktopWidths();
      return;
    }

    const table = this.#element.nativeElement;
    this.#renderer.setStyle(table, 'table-layout', 'fixed');
    this.#renderer.setStyle(table, 'width', '100%');

    const cells = table.querySelectorAll(CELL_SELECTOR);
    cells.forEach((cell) => {
      if (cell.hasAttribute('colspan')) {
        if (cell.getAttribute('data-detail') !== 'true') {
          this.#renderer.setAttribute(cell, 'data-detail', 'true');
          this.#renderer.removeAttribute(cell, 'data-label');
          this.#renderer.removeAttribute(cell, 'data-actions');
        }
        return;
      }

      const colClass = Array.from(cell.classList).find((c) => c.startsWith('mat-column-'));
      const colName = colClass?.replace('mat-column-', '');
      const targetWidth = colName ? widths[colName] : undefined;

      if (targetWidth) {
        if ((cell as HTMLElement).style.width !== targetWidth) {
          this.#renderer.setStyle(cell, 'width', targetWidth);
        }
      } else if ((cell as HTMLElement).style.width) {
        this.#renderer.removeStyle(cell, 'width');
      }
    });
  }

  #clearDesktopWidths(): void {
    const table = this.#element.nativeElement;
    if (table.style.tableLayout) {
      this.#renderer.removeStyle(table, 'table-layout');
    }

    const cells = table.querySelectorAll(CELL_SELECTOR);
    cells.forEach((cell) => {
      if ((cell as HTMLElement).style.width) {
        this.#renderer.removeStyle(cell, 'width');
      }
    });
  }

  #applyLabels(): void {
    const table = this.#element.nativeElement;
    const actionsClass = `mat-column-${this.actionsColumn()}`;

    const columnLabels = new Map<string, string>();
    const headers = table.querySelectorAll('th[mat-header-cell]');

    headers.forEach((th) => {
      const colClass = Array.from(th.classList).find((c) => c.startsWith('mat-column-'));
      if (!colClass) return;

      // Clonem per eliminar l'indicador de sort i obtenir el text net del label
      const clone = th.cloneNode(true) as HTMLElement;
      clone.querySelector('.multi-sort-indicator')?.remove();
      const sortContent = clone.querySelector('.mat-sort-header-content');
      const labelText = (sortContent ?? clone).textContent?.trim() ?? '';

      columnLabels.set(colClass, labelText);
    });

    const cells = table.querySelectorAll('td[mat-cell], td[mat-footer-cell]');
    cells.forEach((td) => {
      if (td.hasAttribute('colspan')) {
        if (td.getAttribute('data-detail') !== 'true') {
          this.#renderer.setAttribute(td, 'data-detail', 'true');
          this.#renderer.removeAttribute(td, 'data-label');
          this.#renderer.removeAttribute(td, 'data-actions');
        }
        return;
      }

      const colClass = Array.from(td.classList).find((c) => c.startsWith('mat-column-'));
      if (!colClass) return;

      const isFooter = td.hasAttribute('mat-footer-cell');
      const label = columnLabels.get(colClass) ?? '';
      const hasButtons = td.querySelector('button, a[mat-icon-button], a[matIconButton]') !== null;
      const isActions = colClass === actionsClass || (label === '' && hasButtons);

      if (isFooter) {
        const isEmpty = td.textContent?.trim() === '' && !hasButtons;
        if (isEmpty) {
          if (td.getAttribute('data-empty-footer') !== 'true') {
            this.#renderer.setAttribute(td, 'data-empty-footer', 'true');
          }
          return;
        } else if (td.hasAttribute('data-empty-footer')) {
          this.#renderer.removeAttribute(td, 'data-empty-footer');
        }
      }

      if (isActions) {
        if (td.getAttribute('data-actions') !== 'true') {
          this.#renderer.setAttribute(td, 'data-actions', 'true');
          this.#renderer.removeAttribute(td, 'data-label');
        }
      } else if (label && td.getAttribute('data-label') !== label) {
        this.#renderer.setAttribute(td, 'data-label', label);
      }
    });
  }
}
