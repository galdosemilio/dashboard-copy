/**
 * GET /warehouse/login/inactivity
 */

import { PageOffset, PageSize } from '../../../shared';

export interface GetLoginInactivityReportsRequest {
  /** Organization to get hierarchy for. */
  organization: string;
  /** A category to filter by. */
  category?: string;
  /** An account type to filter by. */
  accountType?: string;
  /**
   * Indicates whether the aggregates should be rolled up to parent organization.
   * (simple), or if all children organizations should be listed .detailed)
   */
  mode?: string;
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Page offset. */
  offset?: PageOffset;
}
