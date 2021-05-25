import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared/model'
import { FetchAllMeetingRequest, FetchAllMeetingResponse } from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { Schedule } from '@coachcare/sdk'

@Injectable()
export class MeetingsDatabase extends CcrDatabase {
  constructor(private schedule: Schedule) {
    super()
  }

  fetch(criteria: FetchAllMeetingRequest): Observable<FetchAllMeetingResponse> {
    return from(this.schedule.fetchAllMeeting(criteria))
  }
}
