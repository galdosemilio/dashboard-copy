import { Injectable } from '@angular/core';
import { CcrDatabase } from '@app/shared';
import { FetchCallsRequest, FetchCallsResponse } from '@app/shared/selvera-api';
import { from, Observable } from 'rxjs';
import { Conference } from 'selvera-api';

@Injectable()
export class CallHistoryDatabase implements CcrDatabase {
  constructor(private conference: Conference) {}

  fetch(criteria: FetchCallsRequest): Observable<FetchCallsResponse> {
    return from(this.conference.fetchCalls(criteria));
  }
}
