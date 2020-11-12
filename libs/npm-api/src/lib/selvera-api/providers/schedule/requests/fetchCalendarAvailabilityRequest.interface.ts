/**
 * Interface for GET /available/calendar
 */

export interface FetchCalendarAvailabilityRequest {
  providers?: Array<string>
  calendarIds?: Array<string>
  startTime?: string // datetimes with timezone
  endTime?: string
}
