/**
 * Interface for GET /meeting/type/organization/:organization (response)
 */

export interface FetchMeetingTypesResponse {
  typeId: number
  code: string
  description: string
  isActive: boolean
  durations: Array<string> // postgres intervals
}
