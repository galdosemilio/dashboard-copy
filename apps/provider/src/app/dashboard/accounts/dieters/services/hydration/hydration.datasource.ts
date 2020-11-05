import * as moment from 'moment-timezone'
import { Observable } from 'rxjs'

import { NotifierService } from '@app/service'
import { CcrDataSource } from '@app/shared'
import {
  GetHydrationSummaryRequest,
  HydrationSummaryResponse
} from '@coachcare/npm-api'
import { HydrationDatabase } from './hydration.database'

export interface HydrationSummary extends HydrationSummaryResponse {
  dailyGoal: number
}

export class HydrationDataSource extends CcrDataSource<
  HydrationSummary,
  Array<HydrationSummaryResponse>,
  GetHydrationSummaryRequest
> {
  constructor(
    protected notify: NotifierService,
    protected database: HydrationDatabase,
    private dailyGoal: number
  ) {
    super()
  }

  defaultFetch(): Array<HydrationSummaryResponse> {
    return []
  }

  fetch(criteria): Observable<Array<HydrationSummaryResponse>> {
    return this.database.fetchSummary(criteria)
  }

  mapResult(result: Array<HydrationSummaryResponse>): Array<HydrationSummary> {
    return result
      .filter((segment) => moment(segment.date).isSameOrBefore(moment()))
      .map((segment) => ({
        ...segment,
        dailyGoal: this.dailyGoal
          ? Math.round((segment.total * 100) / this.dailyGoal)
          : null
      }))
  }
}
