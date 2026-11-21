import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, catchError, Observable, of, Subscription } from 'rxjs';
import { Paginated, SearchObs, SortField } from '../models/common-models';

export class InfiniteScrollDatasource<T, F = undefined> implements DataSource<T> {
  readonly #searchFn;
  readonly #elementStream = new BehaviorSubject<T[]>([]);
  readonly #limit;

  #viewSubscription?: Subscription;
  #currentSubscription?: Subscription;

  //ordenamiento
  #fields: string[] = [];
  #direction: 'ASC' | 'DESC' = 'ASC';

  #sorts: SortField[] = [];

  #isLoading = false;
  //Filtros
  #filter: F | undefined = undefined;
  //paginación
  #page = 1;

  //resultados fuera
  #totalPages = 0;
  #totalElements = 0;

  //Cache
  readonly #cachedPages = new Set<number>();
  readonly #cachedElements: T[] = [];

  constructor(searchFn: SearchObs<T, F>, limit: number = 20, autoLoading: boolean = true) {
    this.#searchFn = searchFn;
    this.#limit = limit;
    if (autoLoading) {
      this.search(this.#page);
    }
  }

  public get isLoading(): boolean {
    return this.#isLoading;
  }

  public get page() {
    return this.#page;
  }

  public get limit() {
    return this.#limit;
  }

  public get totalElements() {
    return this.#totalElements;
  }

  public get totalPages() {
    return this.#totalPages;
  }

  public get cachedElements() {
    return this.#cachedElements;
  }

  public get sorts() {
    return [...this.#sorts];
  }

  public set sorts(sort: SortField[]) {
    this.#sorts.length = 0;
    this.#sorts.push(...sort);
  }


  public set filter(filters: F) {
    this.#filter = filters;
    this.#resetCacheAndSearch();
  }

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    this.#viewSubscription = collectionViewer.viewChange.subscribe((range) => {
      if (range.end <= this.#cachedElements.length - 3 || this.#isLoading) {
        return;
      }
      this.search(this.#page + 1);
    });

    return this.#elementStream;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.#currentSubscription?.unsubscribe();
    this.#viewSubscription?.unsubscribe();
  }

  private search(page: number) {
    if (this.#cachedPages.has(page)) {
      return;
    }

    this.#page = page;
    this.#isLoading = true;
    const searchQuery = {
      //filtrado
      filters: this.#filter,
      //paginación
      page: page,
      limit: this.#limit,
      //ordenamiento
      direction: this.#direction,
      fields: this.#fields,
    };
    this.#cachedPages.add(searchQuery.page);
    this.#currentSubscription = this.#searchFn(searchQuery)
      .pipe(
        catchError((err) => {
          this.#cachedPages.delete(searchQuery.page);
          return of(<Paginated<T>>{
            totalElements: 0,
            totalPages: 0,
            elements: [],
          });
        }),
      )
      .subscribe((rs) => {
        this.#totalElements = rs.totalElements;
        this.#totalPages = rs.totalPages;

        this.#cachedElements.splice(
          (searchQuery.page - 1) * searchQuery.limit,
          rs.elements.length,
          ...rs.elements,
        );

        this.#elementStream.next([...this.#cachedElements]);
        this.#isLoading = false;
      });
  }

  #resetCacheAndSearch(): void {
    this.#currentSubscription?.unsubscribe();
    this.#isLoading = false;
    this.#page = 1;
    this.#cachedElements.length = 0;
    this.#cachedPages.clear();
    this.search(1);
  }
}
