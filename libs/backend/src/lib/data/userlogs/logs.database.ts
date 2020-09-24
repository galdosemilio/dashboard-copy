import { Injectable } from '@angular/core';
import { AppDatabase } from '@coachcare/backend/model';

import { FetchUserLogRequest, FetchUserLogResponse } from '@coachcare/backend/services';
import { from, Observable } from 'rxjs';
// import { ApiLog } from 'selvera-api';

@Injectable()
export class LogsDatabase extends AppDatabase {
  // constructor(private apiLogs: ApiLog) {
  //   super();
  // }
  fetchUserLog(request: FetchUserLogRequest): Observable<FetchUserLogResponse> {
    return from(new Promise<any>(resolve => resolve()));
  }
}
