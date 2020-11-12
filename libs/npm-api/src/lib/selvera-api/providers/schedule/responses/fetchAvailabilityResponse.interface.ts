/**
 * Interface for GET /available/:availableId (response)
 */

export interface FetchAvailabilityResponse {
  id: string
  day: number // 0 - 6 :: Sunday - Saturday
  account: string
  startTime: string // HH:MM 24h format, minutes must be divisible by 5
  endTime: string
  timezone: string
}
