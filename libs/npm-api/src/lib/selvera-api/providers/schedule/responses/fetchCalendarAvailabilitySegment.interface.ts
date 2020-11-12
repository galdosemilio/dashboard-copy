/**
 * Interface for GET /available/calendar (segment)
 */

export interface FetchCalendarAvailabilitySegment {
  ids: Array<string>
  account: string
  startTime: string
  endTime: string
  timezone: string
  isSingle: boolean
}
