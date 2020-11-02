/**
 * Interface for GET /summary (Response)
 */

import { SupplementDataResponseSegment } from './supplementDataResponseSegment.interface';

export interface FetchSupplementSummaryResponse {
    summary: Array<SupplementDataResponseSegment>;
}
