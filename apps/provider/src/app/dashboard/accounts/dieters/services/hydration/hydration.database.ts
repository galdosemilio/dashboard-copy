import { Injectable } from '@angular/core'

import { from, Observable } from 'rxjs'
import { Hydration } from '@coachcare/npm-api'

import { CcrDatabase } from '@app/shared'
import { GetHydrationSummaryRequest } from '@coachcare/npm-api'

@Injectable()
export class HydrationDatabase extends CcrDatabase {
  constructor(private hydration: Hydration) {
    super()
  }

  fetchSummary(args: GetHydrationSummaryRequest): Observable<any> {
    return from(
      this.hydration
        .fetchSummary({
          startDate: args.startDate,
          endDate: args.endDate,
          unit: args.unit,
          account: args.account
        })
        .then((summaryEntries) => summaryEntries.reverse())
    )
  }
}
