import { PagedResponse } from '@coachcare/sdk'
import { CcrDataSource } from './generic.datasource'

interface PaginatedRequest {
  offset?: number
}

export abstract class TableDataSource<T, R, C> extends CcrDataSource<T, R, C> {
  /**
   * Used to calculate the pagination length.
   * Updated on the mapResult method according to the response data.
   */
  public total = 0
  public totalCount = 0
  public pageIndex = 0
  public pageSize = 10

  public resetPaginator() {
    this.total = 0
    this.pageIndex = 0
  }

  public getTotal(response: PagedResponse<unknown>) {
    if (response.pagination.totalCount) {
      this.total = response.pagination.totalCount
      this.totalCount = response.pagination.totalCount

      return
    }

    this.total = response.pagination?.next
      ? response.pagination.next + response.data.length
      : ((this.criteria as PaginatedRequest)?.offset ?? 0) +
        response.data.length
  }
}
