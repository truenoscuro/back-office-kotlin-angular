import { Observable } from 'rxjs';

export interface Paginated<T> {
  elements: T[];
  totalPages: number;
  totalElements: number;
}

export interface Option<T> {
  value: T;
  label: string;
}
export type SortDirection = 'ASC' | 'DESC';

export interface SearchQuery<T> {
  page: number;
  limit: number;
  filters?: T;
  sort?: SortField[];
}

export interface SortField {
  field: string;
  direction: SortDirection;
}

export type SearchObs<T, F = undefined> = (rq: SearchQuery<F>) => Observable<Paginated<T>>;
