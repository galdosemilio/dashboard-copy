/**
 * GET /warehouse/alert/preference
 */

import { PageOffset, PageSize } from '../../../shared';

export interface GetAllAlertsPreferenceRequest {
  /** Organization to get hierarchy for. */
  organization: string;
  /** Account to retrieve the preferences for. This filter does not exclude organization-wide preferences. */
  account?: string;
  /** Alert type to retrieve the preference for. */
  alertType?: number;
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Page offset. */
  offset?: PageOffset;
}
