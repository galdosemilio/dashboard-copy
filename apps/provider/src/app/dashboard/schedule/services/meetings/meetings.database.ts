import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import {
  FetchAllMeetingRequest,
  FetchAllMeetingResponse
} from '@coachcare/npm-api'
import { from, Observable } from 'rxjs'
import { Schedule } from '@coachcare/npm-api'

@Injectable()
export class MeetingsDatabase extends CcrDatabase {
  constructor(private schedule: Schedule) {
    super()
  }

  fetch(criteria: FetchAllMeetingRequest): Observable<FetchAllMeetingResponse> {
    return from(this.schedule.fetchAllMeeting(criteria))
  }
}
