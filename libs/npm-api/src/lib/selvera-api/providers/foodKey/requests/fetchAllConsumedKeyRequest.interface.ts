/**
 * Interface for GET /key/consumed
 */

export interface FetchAllConsumedKeyRequest {
  organization: string
  account?: string
  key?: string
  startDate?: string
  endDate?: string
  offset?: number
  limit?: number | string
}
