import { CcrPaginatorComponent } from '@coachcare/common/components'
import { TableDataSource } from '@app/shared'
import { GetAllSequencesRequest, PagedResponse } from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import {
  GetAllSequencesRequestWithRefresh,
  GetSequenceResponseWithExtras,
  SequenceAutoEnrollmentsDatabase
} from './sequence-auto-enrollments.database'

export class SequenceAutoEnrollmentsDataSource extends TableDataSource<
  GetSequenceResponseWithExtras,
  PagedResponse<GetSequenceResponseWithExtras>,
  GetAllSequencesRequestWithRefresh
> {
  constructor(
    protected database: SequenceAutoEnrollmentsDatabase,
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

  public defaultFetch(): PagedResponse<GetSequenceResponseWithExtras> {
    return { data: [], pagination: {} }
  }

  public fetch(
    request: GetAllSequencesRequest
  ): Observable<PagedResponse<GetSequenceResponseWithExtras>> {
    return from(this.database.fetch(request))
  }

  public mapResult(
    response: PagedResponse<GetSequenceResponseWithExtras>
  ): any {
    this.getTotal(response)

    return response.data
  }
}
