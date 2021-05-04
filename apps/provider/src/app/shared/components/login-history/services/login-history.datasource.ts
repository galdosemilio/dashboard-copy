import { TableDataSource } from '@app/shared/model'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import {
  GetLoginHistoryRequest,
  LoginHistoryItem,
  PagedResponse
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { LoginHistoryDatabase } from './login-history.database'

export class LoginHistoryDataSource extends TableDataSource<
  LoginHistoryItem,
  PagedResponse<LoginHistoryItem>,
  GetLoginHistoryRequest
> {
  constructor(
    protected database: LoginHistoryDatabase,
    private paginator?: CcrPaginatorComponent
  ) {
    super()

    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize || this.pageSize,
        offset:
          (this.paginator.pageIndex !== undefined
            ? this.paginator.pageIndex
            : this.pageIndex) *
          (this.paginator.pageSize !== undefined
            ? this.paginator.pageSize
            : this.pageSize)
      }))
    }
  }

  defaultFetch(): PagedResponse<LoginHistoryItem> {
    return { data: [], pagination: {} }
  }

  fetch(
    criteria: GetLoginHistoryRequest
  ): Observable<PagedResponse<LoginHistoryItem>> {
    return from(this.database.fetch(criteria))
  }

  mapResult(result: PagedResponse<LoginHistoryItem>): LoginHistoryItem[] {
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset + result.data.length

    return result.data
  }
}
