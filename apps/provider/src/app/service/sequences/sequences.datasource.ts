import { MatPaginator } from '@coachcare/material'
import { TableDataSource } from '@app/shared/model'
import {
  GetAllSequencesRequest,
  GetSequenceResponse,
  PagedResponse
} from '@coachcare/sdk'
import { Observable } from 'rxjs'
import { SequencesDatabase } from './sequences.database'
import { Sequence } from '@app/dashboard/sequencing/models'

export class SequencesDataSource extends TableDataSource<
  any,
  PagedResponse<GetSequenceResponse>,
  GetAllSequencesRequest
> {
  constructor(
    protected database: SequencesDatabase,
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

  defaultFetch(): PagedResponse<GetSequenceResponse> {
    return { data: [], pagination: {} }
  }

  fetch(
    args: GetAllSequencesRequest
  ): Observable<PagedResponse<GetSequenceResponse>> {
    return this.database.fetch(args)
  }

  mapResult(result: PagedResponse<GetSequenceResponse>): any[] {
    // pagination handling
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset + result.data.length

    return result.data.map((r) => new Sequence(r))
  }
}
