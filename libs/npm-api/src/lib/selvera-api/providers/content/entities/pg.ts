import { ListResponse } from '../../common/entities'

export type PageSize = 'all' | number

export type PageOffset = number

// pagination
export interface Pagination {
  next?: number
  prev?: number
}

export interface PagedResponse<T> extends ListResponse<T> {
  pagination: Pagination
}
