import { MatPaginator } from '@coachcare/material'
import { TableDataSource } from '@app/shared'
import {
  GetAllSeqEnrollmentsResponse,
  GetTimeframedSeqEnrollmentsRequest,
  PagedResponse
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { SequenceEnrollmentDatabase } from './sequenceEnrollment.database'

export class SequenceEnrollmentDataSource extends TableDataSource<
  GetAllSeqEnrollmentsResponse,
  PagedResponse<GetAllSeqEnrollmentsResponse>,
  GetTimeframedSeqEnrollmentsRequest
> {
  constructor(
    protected database: SequenceEnrollmentDatabase,
    private paginator?: MatPaginator
  ) {
    super()
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
    request: GetTimeframedSeqEnrollmentsRequest
  ): Observable<PagedResponse<GetAllSeqEnrollmentsResponse>> {
    return from(this.database.fetch(request))
  }

  mapResult(
    result: PagedResponse<GetAllSeqEnrollmentsResponse>
  ): GetAllSeqEnrollmentsResponse[] {
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : (this.criteria.offset as number) + result.data.length
    return result.data
  }
}
