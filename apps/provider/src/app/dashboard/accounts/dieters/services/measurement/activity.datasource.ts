import { from, Observable } from 'rxjs'

import { NotifierService } from '@app/service'
import { CcrDataSource } from '@app/shared'
import { FetchActivityRequest, FetchActivityResponse } from '@coachcare/sdk'
import { MeasurementDatabase } from './measurement.database'

export class ActivityDataSource extends CcrDataSource<
  FetchActivityResponse,
  Array<FetchActivityResponse>,
  FetchActivityRequest
> {
  constructor(
    protected notify: NotifierService,
    protected database: MeasurementDatabase
  ) {
    super()
  }

  defaultFetch(): Array<FetchActivityResponse> {
    return []
  }

  fetch(
    criteria: FetchActivityRequest
  ): Observable<Array<FetchActivityResponse>> {
    return from(this.database.fetchActivity(criteria))
  }

  mapResult(
    result: Array<FetchActivityResponse>
  ): Array<FetchActivityResponse> {
    return result
  }
}
