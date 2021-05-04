import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared/model'
import {
  GetAllSequencesRequest,
  GetSequenceResponse,
  PagedResponse
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { Sequence } from '@coachcare/sdk'

@Injectable()
export class SequencesDatabase extends CcrDatabase {
  constructor(private sequence: Sequence) {
    super()
  }

  fetch(
    request: GetAllSequencesRequest
  ): Observable<PagedResponse<GetSequenceResponse>> {
    return from(this.sequence.getAllSequences(request))
  }
}
