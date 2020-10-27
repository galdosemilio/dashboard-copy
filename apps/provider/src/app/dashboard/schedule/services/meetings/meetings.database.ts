import { Injectable } from '@angular/core';
import { CcrDatabase } from '@app/shared';
import { FetchAllMeetingRequest, FetchAllMeetingResponse } from '@app/shared/selvera-api';
import { from, Observable } from 'rxjs';
import { Schedule } from 'selvera-api';

@Injectable()
export class MeetingsDatabase extends CcrDatabase {
  constructor(private schedule: Schedule) {
    super();
  }

  fetch(criteria: FetchAllMeetingRequest): Observable<FetchAllMeetingResponse> {
    return from(this.schedule.fetchAllMeeting(criteria));
  }
}
