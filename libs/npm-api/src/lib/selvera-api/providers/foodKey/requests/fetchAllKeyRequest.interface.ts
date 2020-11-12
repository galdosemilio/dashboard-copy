/**
 * Interface for GET /key
 */

export interface FetchAllKeyRequest {
  name?: string
  offset?: string
  includeInactive?: boolean
}
