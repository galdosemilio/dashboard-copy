import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MeasurementBody, Reports } from 'selvera-api';

import { CcrDatabase } from '@app/shared';
import {
  FetchBodySummaryRequest,
  FetchBodySummaryResponse
} from '@app/shared/selvera-api';

@Injectable()
export class LevlDatabase extends CcrDatabase {
  constructor(private body: MeasurementBody) {
    super();
  }

  fetchAcetonePpm(req: FetchBodySummaryRequest): Promise<FetchBodySummaryResponse> {
    return this.body.fetchSummary(req);
  }
}
