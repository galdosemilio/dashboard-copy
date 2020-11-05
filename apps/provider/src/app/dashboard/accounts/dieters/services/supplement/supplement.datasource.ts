import * as moment from 'moment-timezone'
import { from, Observable, throwError as observableThrowError } from 'rxjs'

import { NotifierService } from '@app/service'
import { _, CcrDataSource } from '@app/shared'
import {
  FetchSupplementsResponse,
  FetchSupplementsSegment,
  FetchSupplementSummaryRequest,
  FetchSupplementSummaryResponse
} from '@coachcare/npm-api'
import { SupplementDatabase } from './supplement.database'

export type SupplementCriteria = FetchSupplementSummaryRequest & {
  organization: string
}

export class SupplementDataSource extends CcrDataSource<
  any,
  any,
  SupplementCriteria
> {
  supplements: Array<FetchSupplementsSegment> = []
  columns: Array<string> = []

  constructor(
    protected notify: NotifierService,
    protected database: SupplementDatabase
  ) {
    super()
  }

  preQuery() {
    super.preQuery()
    this.supplements = []
    this.columns = []
  }

  defaultFetch(): [FetchSupplementsResponse, FetchSupplementSummaryResponse] {
    return [{ data: [], pagination: {} }, { summary: [] }]
  }

  fetch(
    criteria: SupplementCriteria
  ): Observable<[FetchSupplementsResponse, FetchSupplementSummaryResponse]> {
    if (criteria.organization) {
      return from(
        Promise.all([
          this.database.fetchSupplements(criteria.organization),
          this.database.fetchSummary(criteria)
        ])
      )
    }
    return observableThrowError(
      'Missing Organization to fetch Supplements from.'
    )
  }

  mapResult(
    result: [FetchSupplementsResponse, FetchSupplementSummaryResponse]
  ) {
    this.supplements = result[0].data.length ? result[0].data : []

    this.columns = this.supplements.length
      ? [
          'date',
          ...this.supplements.map((s) =>
            s.supplement.fullName.split(' ').join('_')
          )
        ]
      : ['date']

    const supplementArray = []

    if (!this.supplements.length) {
      this.addError(_('NOTIFY.SOURCE.NO_SUPPLEMENTS_FOUND'))
    } else {
      const now = moment()
      let i = 0
      result[1].summary
        .filter((segment) => moment(segment.date).isSameOrBefore(now))
        .forEach((s) => {
          supplementArray[i] = {}
          supplementArray[i].date = s.date
          s.consumption.forEach((c) => {
            supplementArray[i][`${c.supplement.name.split(' ').join('_')}`] =
              c.quantity
          })
          i++
        })
    }

    return supplementArray
  }
}
