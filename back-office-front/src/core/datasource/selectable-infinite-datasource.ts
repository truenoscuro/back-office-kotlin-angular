import { CollectionViewer, DataSource, SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { InfiniteScrollDatasource } from './infinite-scroll-datasource';

export type ListRow<T> = { type: 'item'; data: T; isTopSection: boolean } | { type: 'divider' };

export class SelectableInfiniteDatasource<T, F = undefined> implements DataSource<ListRow<T>> {
  readonly #pinnedSelection$ = new BehaviorSubject<T[]>([]);

  constructor(
    private db: InfiniteScrollDatasource<T, F>,
    private selection: SelectionModel<T>,
  ) {
    this.syncPinnedSelection();
  }

  public syncPinnedSelection(): void {
    this.#pinnedSelection$.next([...this.selection.selected]);
  }

  connect(collectionViewer: CollectionViewer): Observable<ListRow<T>[]> {
    const adjustedViewer: CollectionViewer = {
      viewChange: collectionViewer.viewChange.pipe(
        map((range) => {
          const topOffset = this.selection.isEmpty() ? 0 : this.selection.selected.length + 1;

          const hiddenInDbCount = this.db.cachedElements.filter((item) =>
            this.selection.isSelected(item),
          ).length;

          const realEnd = Math.max(0, range.end - topOffset) + hiddenInDbCount;

          return {
            start: Math.max(0, range.start - topOffset),
            end: realEnd,
          };
        }),
      ),
    };

    return combineLatest([this.#pinnedSelection$, this.db.connect(adjustedViewer)]).pipe(
      map(([pinned, dbItems]) => {
        const rows: ListRow<T>[] = [];

        if (pinned.length > 0) {
          rows.push(...pinned.map((data) => ({ type: 'item' as const, data, isTopSection: true })));
          rows.push({ type: 'divider' });
        }

        rows.push(
          ...dbItems
            .filter((data) => !this.selection.isSelected(data))
            .map((data) => ({ type: 'item' as const, data, isTopSection: false })),
        );
        return rows;
      }),
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.db.disconnect(collectionViewer);
  }
}
