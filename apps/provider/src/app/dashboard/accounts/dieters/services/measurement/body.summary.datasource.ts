import { from, Observable } from 'rxjs';

import { NotifierService } from '@app/service';
import { CcrDataSource } from '@app/shared';
import {
  BodySummaryDataResponseSegment,
  FetchBodySummaryRequest,
  FetchBodySummaryResponse
} from '@app/shared/selvera-api';
import { MeasurementDatabase } from './measurement.database';

export class BodySummaryDataSource extends CcrDataSource<
  BodySummaryDataResponseSegment,
  FetchBodySummaryResponse,
  FetchBodySummaryRequest
> {
  constructor(
    protected notify: NotifierService,
    protected database: MeasurementDatabase
  ) {
    super();
  }

  defaultFetch(): FetchBodySummaryResponse {
    return {
      data: [],
      summary: {}
    };
  }

  fetch(): Observable<FetchBodySummaryResponse> {
    return from(this.database.fetchBodySummary(this.criteria));
  }

  mapResult(result: FetchBodySummaryResponse): BodySummaryDataResponseSegment[] {
    return result.data;
  }
}
