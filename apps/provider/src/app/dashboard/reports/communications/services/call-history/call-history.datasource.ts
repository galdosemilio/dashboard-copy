import { CcrPaginator, TableDataSource } from '@app/shared'
import {
  GetAllInteractionsRequest,
  InteractionSingle,
  PagedResponse
} from '@coachcare/npm-api'
import { Observable } from 'rxjs'
import { CallHistoryItem } from '../../models'
import { CallHistoryDatabase } from './call-history.database'

export class CallHistoryDataSource extends TableDataSource<
  CallHistoryItem,
  PagedResponse<InteractionSingle>,
  GetAllInteractionsRequest
> {
  public hasNonDeletableEntry = false

  constructor(
    protected database: CallHistoryDatabase,
    private paginator?: CcrPaginator
  ) {
    super()
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize || this.pageSize,
        offset:
          (this.paginator.pageIndex || this.pageIndex) *
          (this.paginator.pageSize || this.pageSize)
      }))
    }
  }

  defaultFetch(): PagedResponse<InteractionSingle> {
    return { data: [], pagination: {} }
  }

  fetch(
    criteria: GetAllInteractionsRequest
  ): Observable<PagedResponse<InteractionSingle>> {
    return this.database.fetch(criteria)
  }

  mapResult(response: PagedResponse<InteractionSingle>): CallHistoryItem[] {
    this.total = response.pagination.next
      ? response.pagination.next + 1
      : this.criteria.offset + response.data.length

    const mappedResponse = response.data
      .reverse()
      .map((item) => new CallHistoryItem(item))
      .reverse()

    this.hasNonDeletableEntry = mappedResponse.some(
      (interactionItem) => !interactionItem.canBeDeleted
    )

    return mappedResponse
  }
}
