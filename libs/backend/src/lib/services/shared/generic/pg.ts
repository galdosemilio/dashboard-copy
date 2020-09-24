/**
 * Pagination and Sort
 */

export type PageSize = 'all' | number;

export type PageOffset = number;

// pagination
export interface Pagination {
  next?: number;
  prev?: number;
}

export interface ListResponse<T> {
  data: Array<T>;
}

export interface PagedResponse<T> extends ListResponse<T> {
  pagination: Pagination;
}

// sort
export type SortDirection = 'asc' | 'desc';

export interface Sort<K> {
  property: K;
  dir?: SortDirection;
}

export interface SortedQuery<T> {
  sort?: Array<Sort<T>>;
}
