/**
 * Interface for GET /measurement/body/summary (response)
 */

import { SummaryDataResponseSegment } from './summaryDataResponseSegment.interface';
import { SummaryResponse } from './summaryResponse.interface';

export interface FetchBodySummaryResponse {
    data: Array<SummaryDataResponseSegment>;
    summary: SummaryResponse;
}
