/**
 * POST /account/:id/preference
 */

import { CalendarViewType } from '../../../shared';

export interface CreateAccountPreferenceRequest {
  /** ID of the account. */
  id: string;
  /** calendar view preference for the account. */
  calendarView?: CalendarViewType;
  /** default organization preference for the account. */
  defaultOrganization?: string;
  /** Healthy badge station text. */
  healthyBadgeStation?: string;
}
