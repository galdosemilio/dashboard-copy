export interface CountedPaginatedResponse<T> {
  data: T[]
  pagination: {
    next?: number
    prev?: number
    totalCount: number
  }
}
