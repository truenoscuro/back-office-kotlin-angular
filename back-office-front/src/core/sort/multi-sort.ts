import { Directive, effect, input, model, output, untracked } from '@angular/core';
import { SortDirection, SortField } from '../models/common-models';
import { TableDatasource } from '../datasource/table-datasource';

@Directive({
  selector: 'table[multiSort]',
})
export class MultiSort<T, F = undefined> {
  /** Màxim de columnes simultànies per ordenar (per defecte 3) */
  readonly maxSorts = input<number>(3);

  /** Estat bidireccional amb l'array [{ field, direction }, ...] */
  readonly sorts = model<SortField[]>([]);

  /** Emet l'array d'objectes cada vegada que canvia l'ordenació */
  readonly sortChange = output<SortField[]>();
  readonly datasource = input<TableDatasource<T, F>>(undefined, { alias: 'dataSource' });
  startSort = false;
  #setSorts = effect(() => {
    const datasource = this.datasource();
    //La primera vez si hay en datasource los añade para que vayan a la par
    if (datasource && datasource.sorts.length > 0 && this.startSort) {
      untracked(() => {
        this.sorts.set([...datasource.sorts]);
      });
    }
    if (datasource) {
      datasource.sorts = this.sorts();
      datasource.search();
    }
    this.startSort = false;
  });

  toggle(field: string): void {
    const current = [...this.sorts()];
    const index = current.findIndex((s) => s.field === field);

    if (index === -1) {
      if (current.length >= this.maxSorts()) {
        current.shift();
      }
      current.push({ field, direction: 'ASC' });
    } else if (current[index].direction === 'ASC') {
      current[index] = { field, direction: 'DESC' };
    } else {
      current.splice(index, 1);
    }

    this.sorts.set([...current]);

    this.sortChange.emit(current);
  }

  getSortState(field: string): { order: number; direction: SortDirection } | null {
    const index = this.sorts().findIndex((s) => s.field === field);
    if (index === -1) return null;
    return {
      order: index + 1,
      direction: this.sorts()[index].direction,
    };
  }

  clear(): void {
    this.sorts.set([]);
    this.sortChange.emit([]);
  }
}
