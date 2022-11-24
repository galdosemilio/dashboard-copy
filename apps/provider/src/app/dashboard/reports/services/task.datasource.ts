import { CcrPaginatorComponent } from '@coachcare/common/components'
import { NotifierService } from '@app/service'
import { TableDataSource } from '@app/shared/model'
import {
  FetchTasksRequest,
  FetchTasksResponse,
  TaskEntity
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { TaskDatabase } from './task.database'

export class TaskDataSource extends TableDataSource<
  TaskEntity,
  FetchTasksResponse,
  FetchTasksRequest
> {
  public totalCount?: number

  constructor(
    protected database: TaskDatabase,
    protected notify: NotifierService,
    private paginator?: CcrPaginatorComponent
  ) {
    super()

    // listen the paginator events
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize,
        offset: this.paginator.pageIndex * (this.paginator.pageSize ?? 50)
      }))
    }
  }

  defaultFetch(): FetchTasksResponse {
    return { data: [], pagination: {} }
  }

  fetch(criteria: FetchTasksRequest): Observable<FetchTasksResponse> {
    return from(this.database.fetchTasks(criteria))
  }

  mapResult(result: FetchTasksResponse): Array<TaskEntity> {
    // pagination handling
    this.total = this.getTotal(result)

    this.totalCount = result.pagination.totalCount ?? 0

    if (!result || !result.data.length) {
      return []
    }

    return result.data
  }
}
