/**
 * GET /account/:id/preference
 */

import { CalendarViewType } from '../../common/entities'

export interface AccountPreferenceSingle {
  /** Calendar view preference. */
  calendarView?: CalendarViewType
  /** Default organization ID. */
  defaultOrganization?: string
  /** Healthy badge station text. */
  healthyBadgeStation?: string
}
