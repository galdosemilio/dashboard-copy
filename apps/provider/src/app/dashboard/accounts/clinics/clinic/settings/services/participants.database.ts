import { Injectable } from '@angular/core'
import { from, Observable } from 'rxjs'
import { CcrDatabase } from '@app/shared'
import {
  GetOrgAutoThreadListingRequest,
  GetOrgAutoThreadParticipantListingResponse,
  MessagingPreference
} from '@coachcare/sdk'

@Injectable()
export class ParticipantDatabase extends CcrDatabase {
  constructor(private messagingPreference: MessagingPreference) {
    super()
  }

  fetch(
    args: GetOrgAutoThreadListingRequest
  ): Observable<GetOrgAutoThreadParticipantListingResponse> {
    return from(this.messagingPreference.getOrgThreadAutoParticipants(args))
  }
}
