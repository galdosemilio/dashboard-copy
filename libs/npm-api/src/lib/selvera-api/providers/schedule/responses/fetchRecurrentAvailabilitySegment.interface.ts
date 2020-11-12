/**
 * Interface for GET /available (response)
 */

export interface FetchRecurrentAvailabilitySegment {
  id: string
  day: number
  account: string
  startTime: string
  endTime: string
  timezone: string
}
