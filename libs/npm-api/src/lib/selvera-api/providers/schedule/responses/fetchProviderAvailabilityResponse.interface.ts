/**
 * Interface for GET /scheduler (response)
 */

export interface FetchProviderAvailabilitySegment {
  account: string
  startTime: string // ISO8601 format
}
