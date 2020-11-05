import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import {
  GetAllInteractionsRequest,
  InteractionSingle,
  PagedResponse
} from '@coachcare/npm-api'
import { from, Observable } from 'rxjs'
import { Interaction } from '@coachcare/npm-api'

@Injectable()
export class CallHistoryDatabase implements CcrDatabase {
  constructor(private interaction: Interaction) {}

  public fetch(
    criteria: GetAllInteractionsRequest
  ): Observable<PagedResponse<InteractionSingle>> {
    return from(this.interaction.getAll(criteria))
  }
}
