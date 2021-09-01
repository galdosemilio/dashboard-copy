import { Injectable } from '@angular/core'

import { from, Observable } from 'rxjs'
import {
  DataPointTypes,
  MeasurementDataPointAggregate,
  MeasurementDataPointProvider
} from '@coachcare/sdk'

import { CcrDatabase } from '@app/shared'
import { GetHydrationSummaryRequest } from '@coachcare/sdk'

@Injectable()
export class HydrationDatabase extends CcrDatabase {
  constructor(private measurement: MeasurementDataPointProvider) {
    super()
  }

  fetchSummary(
    args: GetHydrationSummaryRequest
  ): Observable<Array<MeasurementDataPointAggregate>> {
    return from(
      this.measurement
        .getAggregates({
          type: [DataPointTypes.HYDRATION],
          account: args.account,
          recordedAt: {
            start: args.startDate,
            end: args.endDate
          },
          unit: args.unit,
          limit: 'all'
        })
        .then((res) => res.data)
    )
  }
}
