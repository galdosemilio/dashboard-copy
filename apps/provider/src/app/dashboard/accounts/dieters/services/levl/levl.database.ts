import { Injectable } from '@angular/core'
import { MeasurementBody } from '@coachcare/sdk'

import { CcrDatabase } from '@app/shared'
import {
  FetchBodySummaryRequest,
  FetchBodySummaryResponse
} from '@coachcare/sdk'

@Injectable()
export class LevlDatabase extends CcrDatabase {
  constructor(private body: MeasurementBody) {
    super()
  }

  fetchAcetonePpm(
    req: FetchBodySummaryRequest
  ): Promise<FetchBodySummaryResponse> {
    return this.body.fetchSummary(req)
  }
}
