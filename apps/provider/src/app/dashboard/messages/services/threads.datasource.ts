import { MatPaginator } from '@coachcare/common/material'
import { Observable } from 'rxjs'

import { NotifierService } from '@app/service/notifier.service'
import { TableDataSource } from '@app/shared'
import {
  GetAllMessagingResponse,
  MessagingThreadSegment
} from '@coachcare/npm-api'
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
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset + result.data.length

    this.completed = !result.pagination.next

    if (result.data.length === 0) {
      return []
    }

    return this.criteria.limit
      ? result.data.slice(0, this.criteria.limit)
      : result.data
  }
}
