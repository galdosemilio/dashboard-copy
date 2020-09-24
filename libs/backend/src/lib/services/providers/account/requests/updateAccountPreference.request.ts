/**
 * PATCH /account/:id/preference
 */

import { CalendarViewType } from '../../../shared';

export interface UpdateAccountPreferenceRequest {
  /** ID of the account. */
  id: string;
  /** Calendar view preference for the account. */
  calendarView?: CalendarViewType;
  /** Default organization preference for the account. */
  defaultOrganization?: string;
  /** Healthy badge station text. */
  healthyBadgeStation?: string;
}
