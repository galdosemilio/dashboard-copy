import { PagedResponse } from '@coachcare/sdk'
import { AppDataSource } from './generic.datasource'

export abstract class TableDataSource<T, R, C> extends AppDataSource<T, R, C> {
  /**
   * Used to calculate the pagination length.
   * Updated on the mapResult method according to the response data.
   */
  total = 0

  public getTotal(result: unknown): number {
    const response = result as PagedResponse<R>

    if (response.pagination.totalCount) {
      return response.pagination.totalCount
    }

    if (response.pagination?.next) {
      /**
       * Set total as next + data.length if it's not available totalCount
       * B/C MatPaginator requires set total for pagination
       * If we don't have total, hasNextPage() is false in MatPaginator and next button will disabled
       */
      return response.pagination.next + response.data.length
    }

    return response.data.length
  }
}
