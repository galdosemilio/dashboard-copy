/**
 * GET /pain-tracking/type
 */

import { PainTypeId } from '../../../shared';

export interface GetTypesPainTrackingResponse {
  /** Pain types list. */
  data: Array<{
    /** Pain type ID. */
    id: PainTypeId;
    /** Pain type description. */
    description: string;
  }>;
}
