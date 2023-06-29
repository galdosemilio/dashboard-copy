import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import {
  GetSeqTransitionPendingRequest,
  PagedResponse,
  ProjectedTransition,
  Sequence
} from '@coachcare/sdk'

@Injectable()
export class UpcomingTransitionsDatabase extends CcrDatabase {
  constructor(private sequence: Sequence) {
    super()
  }

  fetch(
    request: GetSeqTransitionPendingRequest
  ): Promise<PagedResponse<ProjectedTransition>> {
    return this.sequence.getSeqTransitionPending(request)
  }
}
