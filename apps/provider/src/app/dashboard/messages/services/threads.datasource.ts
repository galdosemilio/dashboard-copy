import { MatPaginator } from '@coachcare/material'
import { Observable } from 'rxjs'

import { NotifierService } from '@app/service/notifier.service'
import { TableDataSource } from '@app/shared'
import { GetAllMessagingResponse, MessagingThreadSegment } from '@coachcare/sdk'
import { ThreadsCriteria } from './threads.criteria'
import { ThreadsDatabase } from './threads.database'

export class ThreadsDataSource extends TableDataSource<
  MessagingThreadSegment,
  GetAllMessagingResponse,
  ThreadsCriteria
> {
  completed = false

  constructor(
    protected notify: NotifierService,
    protected database: ThreadsDatabase,
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

  defaultFetch(): GetAllMessagingResponse {
    return {
      data: [],
      pagination: { next: null, prev: null }
    }
  }

  fetch(criteria: ThreadsCriteria): Observable<GetAllMessagingResponse> {
    return this.database.fetchAll(criteria)
  }

  mapResult(result: GetAllMessagingResponse): Array<MessagingThreadSegment> {
    // pagination handling
    this.total = this.getTotal(result)

    this.completed = !result.pagination.next

    if (result.data.length === 0) {
      return []
    }

    return this.criteria.limit
      ? result.data.slice(0, this.criteria.limit)
      : result.data
  }
}
