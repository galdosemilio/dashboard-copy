import { TableDataSource } from '@app/shared'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import {
  GetAllInteractionsRequest,
  InteractionSingle,
  PagedResponse
} from '@coachcare/sdk'
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
    private paginator?: CcrPaginatorComponent
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
    this.getTotal(response as any)

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
