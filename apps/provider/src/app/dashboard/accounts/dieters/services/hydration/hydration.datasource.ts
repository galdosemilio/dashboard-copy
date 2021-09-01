import * as moment from 'moment-timezone'
import { Observable } from 'rxjs'

import { NotifierService } from '@app/service'
import { CcrDataSource } from '@app/shared'
import {
  GetHydrationSummaryRequest,
  MeasurementDataPointAggregate
} from '@coachcare/sdk'
import { HydrationDatabase } from './hydration.database'

export interface HydrationSummary extends MeasurementDataPointAggregate {
  dailyGoal: number
}

export class HydrationDataSource extends CcrDataSource<
  HydrationSummary,
  Array<MeasurementDataPointAggregate>,
  GetHydrationSummaryRequest
> {
  constructor(
    protected notify: NotifierService,
    protected database: HydrationDatabase,
    private dailyGoal: number
  ) {
    super()
  }

  defaultFetch(): Array<MeasurementDataPointAggregate> {
    return []
  }

  fetch(criteria): Observable<Array<MeasurementDataPointAggregate>> {
    return this.database.fetchSummary(criteria)
  }

  mapResult(
    result: Array<MeasurementDataPointAggregate>
  ): Array<HydrationSummary> {
    return result
      .filter((entry) =>
        moment(entry.bucket.timestamp).isSameOrBefore(moment())
      )
      .map((entry) => ({
        ...entry,
        dailyGoal: this.dailyGoal
          ? Math.round((entry.point.value * 100) / this.dailyGoal)
          : null
      }))
  }
}
