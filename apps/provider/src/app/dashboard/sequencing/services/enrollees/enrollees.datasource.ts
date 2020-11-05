import { MatPaginator } from '@coachcare/common/material'
import { TableDataSource } from '@app/shared/model'
import {
  GetAllSeqEnrollmentsResponse,
  GetTimeframedSeqEnrollmentsRequest,
  PagedResponse
} from '@coachcare/npm-api'
import { Observable } from 'rxjs'
import { EnrolleesDatabase } from './enrollees.database'

export class EnrolleesDataSource extends TableDataSource<
  GetAllSeqEnrollmentsResponse,
  PagedResponse<GetAllSeqEnrollmentsResponse>,
  GetTimeframedSeqEnrollmentsRequest
> {
  constructor(
    protected database: EnrolleesDatabase,
    private paginator?: MatPaginator
  ) {
    super()
    // listen the paginator events
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize,
        offset: this.paginator.pageIndex * this.paginator.pageSize
      }))
    }
  }

  defaultFetch(): PagedResponse<GetAllSeqEnrollmentsResponse> {
    return { data: [], pagination: {} }
  }

  fetch(
    criteria: GetTimeframedSeqEnrollmentsRequest
  ): Observable<PagedResponse<GetAllSeqEnrollmentsResponse>> {
    return this.database.fetch(criteria)
  }

  mapResult(
    result: PagedResponse<GetAllSeqEnrollmentsResponse>
  ): GetAllSeqEnrollmentsResponse[] {
    // pagination handling
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset + result.data.length

    return result.data
  }
}
