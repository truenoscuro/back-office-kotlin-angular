import { Directive, effect, inject, input } from '@angular/core';
import { TableDatasource } from '../datasource/table-datasource';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AppContext } from '../app-context/app-context';

@Directive({
  selector: 'mat-paginator[dataSource]',
  host: {
    class: 'stable-paginator',
    '(page)': 'handlePage($event)',
    '[class.is-mobile]': 'isMobile()',
  },
})
export class PaginatorDatasource<T, F = undefined> {
  /** El teu DataSource personalitzat */
  readonly datasource = input.required<TableDatasource<T, F>>({ alias: 'dataSource' });

  /** Opcions per defecte de mida de pàgina */
  readonly pageSizeOptions = input<number[]>([50, 25, 10]);
  protected readonly isMobile = inject(AppContext).isMobile;
  readonly #paginator = inject(MatPaginator);

  readonly #syncEffect = effect(() => {
    const ds = this.datasource();

    const length = ds.totalElements;
    const size = ds.limit;
    const index = ds.page;

    this.#paginator.length = length;
    this.#paginator.pageSize = size;
    this.#paginator.pageIndex = index;
    this.#paginator.pageSizeOptions = this.pageSizeOptions();
    this.#paginator.showFirstLastButtons = true;
  });

  protected handlePage(event: Event): void {
    const pageEvent = event as unknown as PageEvent;
    this.datasource().page = pageEvent.pageIndex;
    this.datasource().limit = pageEvent.pageSize;
    this.datasource().search();
  }
}
