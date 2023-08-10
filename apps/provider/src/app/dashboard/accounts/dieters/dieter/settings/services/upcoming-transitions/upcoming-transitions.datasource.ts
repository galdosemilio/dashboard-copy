import { Directive } from '@angular/core'
import { MatPaginator } from '@coachcare/material'
import { TableDataSource } from '@app/shared'
import {
  GetSeqTransitionPendingRequest,
  PagedResponse,
  ProjectedTransition,
  SequenceTrigger
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { UpcomingTransitionsDatabase } from './upcoming-transitions.database'

export interface UpcomingTransition extends ProjectedTransition {
  trigger?: SequenceTrigger
}

@Directive()
export class UpcomingTransitionsDataSource extends TableDataSource<
  UpcomingTransition,
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
        limit: this.paginator.pageSize || 10,
        offset: this.paginator.pageIndex * this.paginator.pageSize || 0
      }))
    }
  }

  defaultFetch(): PagedResponse<UpcomingTransition> {
    return { data: [], pagination: {} }
  }

  fetch(
    request: GetSeqTransitionPendingRequest
  ): Observable<PagedResponse<UpcomingTransition>> {
    return from(this.database.fetch(request))
  }

  mapResult(result: PagedResponse<ProjectedTransition>): UpcomingTransition[] {
    this.getTotal(result)

    return result.data.reduce<UpcomingTransition[]>((acc, transition) => {
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
