import { Directive } from '@angular/core'
import { MatPaginator } from '@coachcare/material'
import { TableDataSource } from '@app/shared'
import {
  GetSeqTransitionPendingRequest,
  PagedResponse,
  ProjectedTransition
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { UpcomingTransitionsDatabase } from './upcoming-transitions.database'

@Directive()
export class UpcomingTransitionsDataSource extends TableDataSource<
  ProjectedTransition,
  PagedResponse<ProjectedTransition>,
  GetSeqTransitionPendingRequest
> {
  constructor(
    protected database: UpcomingTransitionsDatabase,
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

  defaultFetch(): PagedResponse<ProjectedTransition> {
    return { data: [], pagination: {} }
  }

  fetch(
    request: GetSeqTransitionPendingRequest
  ): Observable<PagedResponse<ProjectedTransition>> {
    return from(this.database.fetch(request))
  }

  mapResult(result: PagedResponse<ProjectedTransition>): ProjectedTransition[] {
    return result.data.reduce((acc, transition) => {
      if (transition.triggers.length) {
        transition.triggers.forEach((trigger) => {
          acc.push({
            ...transition,
            trigger
          })
        })

        return acc
      }

      acc.push(transition)
      return acc
    }, [])
  }
}
