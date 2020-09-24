/**
 * GET /warehouse/alert/type
 */

import { PageOffset, PageSize } from '../../../shared';

export interface GetTypesAlertsRequest {
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Page offset. */
  offset?: PageOffset;
}
