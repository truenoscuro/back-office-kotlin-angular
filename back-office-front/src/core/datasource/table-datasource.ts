import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, catchError, Observable, of, Subscription } from 'rxjs';
import { Paginated, SearchObs, SortField } from '../models/common-models';

export class TableDatasource<T, F = undefined> implements DataSource<T> {
  readonly #searchFn;
  readonly #elementStream = new BehaviorSubject<T[]>([]);
  #elements: T[] = [];
  #currentSubscription?: Subscription;
  #isLoading = false;
  //ordenamiento
  #sorts: SortField[] = [];

  //Filtros
  #filter: F | undefined;

  //paginación
  #page = 1;
  #limit;

  //resultados fuera
  #totalPages = 0;
  #totalElements = 0;

  constructor(
    searchFn: SearchObs<T, F>,
    options?: {
      autoLoading?: boolean;
      limit?: number;
      sorts?: SortField[];
      filter?: F;
    },
  ) {
    this.#searchFn = searchFn;
    this.#limit = options?.limit ?? 50;
    this.#sorts = options?.sorts ?? [];
    this.#filter = options?.filter;
    if (options?.autoLoading !== false) {
      this.search();
    }
  }

  public get page() {
    return this.#page;
  }

  public set page(page: number) {
    if (page <= 0) {
      page = 1;
    }
    this.#page = page;
  }

  public get limit() {
    return this.#limit;
  }

  public set limit(limit: number) {
    this.#limit = limit;
  }

  public get filter() {
    return this.#filter;
  }

  public set filter(filters: F | undefined) {
    this.#filter = filters;
    this.#page = 1;
  }

  public get sorts() {
    return [...this.#sorts];
  }
  public set sorts(sorts: SortField[]) {
    this.#sorts = sorts;
  }

  public get elements() {
    return this.#elements;
  }

  public get totalPages() {
    return this.#totalPages;
  }

  public get totalElements() {
    return this.#totalElements;
  }
  public get isLoading() {
    return this.#isLoading;
  }

  public search() {
    this.#isLoading = true;
    const searchQuery = {
      //filtrado
      filters: this.#filter,
      //paginación
      page: this.#page,
      limit: this.#limit,
      //ordenamiento
      sorts: this.#sorts,
    };
    this.#currentSubscription?.unsubscribe();
    this.#currentSubscription = this.#searchFn(searchQuery)
      .pipe(
        catchError((err) => {
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
        this.#elements = rs.elements;
        this.#elementStream.next([...this.#elements]);
        this.#isLoading = false;
      });
  }

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return this.#elementStream;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.#currentSubscription?.unsubscribe();
  }
}
