import { Injectable } from '@angular/core'
import {
  GetAllSeqEnrollmentsResponse,
  GetTimeframedSeqEnrollmentsRequest,
  PagedResponse
} from '@coachcare/npm-api'
import { from, Observable } from 'rxjs'
import { Sequence } from '@coachcare/npm-api'

@Injectable()
export class EnrolleesDatabase {
  constructor(private sequence: Sequence) {}

  fetch(
    request: GetTimeframedSeqEnrollmentsRequest
  ): Observable<PagedResponse<GetAllSeqEnrollmentsResponse>> {
    return from(this.sequence.getTimeframedSeqEnrollment(request))
  }
}
