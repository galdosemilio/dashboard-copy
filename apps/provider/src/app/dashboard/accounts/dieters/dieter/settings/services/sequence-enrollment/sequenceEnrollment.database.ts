import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import {
  GetAllSeqEnrollmentsResponse,
  GetTimeframedSeqEnrollmentsRequest,
  PagedResponse,
  Sequence
} from '@coachcare/sdk'

@Injectable()
export class SequenceEnrollmentDatabase extends CcrDatabase {
  constructor(private sequence: Sequence) {
    super()
  }

  fetch(
    request: GetTimeframedSeqEnrollmentsRequest
  ): Promise<PagedResponse<GetAllSeqEnrollmentsResponse>> {
    return this.sequence.getTimeframedSeqEnrollment(request)
  }
}
