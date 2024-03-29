import { Injectable } from '@angular/core'
import { Supplement } from '@coachcare/sdk'

import { CcrDatabase } from '@app/shared'
import {
  FetchSupplementsResponse,
  FetchSupplementSummaryRequest,
  FetchSupplementSummaryResponse
} from '@coachcare/sdk'

@Injectable()
export class SupplementDatabase extends CcrDatabase {
  constructor(private supplement: Supplement) {
    super()
  }

  fetchSummary(
    args: FetchSupplementSummaryRequest
  ): Promise<FetchSupplementSummaryResponse> {
    return this.supplement.fetchSummary(args)
  }

  fetchSupplements(id: string): Promise<FetchSupplementsResponse> {
    return this.supplement.fetchSupplementsFor(id)
  }
}
