import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import {
  GetSequenceTriggerHistoryRequest,
  PagedResponse,
  Sequence,
  TriggerHistoryItem
} from '@coachcare/npm-api'

@Injectable()
export class TriggerHistoryDatabase extends CcrDatabase {
  constructor(private sequence: Sequence) {
    super()
  }

  fetch(
    request: GetSequenceTriggerHistoryRequest
  ): Promise<PagedResponse<TriggerHistoryItem>> {
    return this.sequence.getSequenceTriggerHistory(request)
  }
}
