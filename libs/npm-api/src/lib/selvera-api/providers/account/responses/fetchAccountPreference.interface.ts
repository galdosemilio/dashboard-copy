/**
 * Interface for object GET /account/:account/preference
 */

export interface FetchAccountPreference {
  calendarView?: 'list' | 'calendar:month' | 'calendar:day'
  defaultOrganization?: string
  healthyBadgeStation?: string
}
