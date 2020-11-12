/**
 * Interface for GET /organization
 */

export interface OrgDescendantsRequest {
  id?: string
  organization: number | string
  query?: string
  offset?: number
  limit?: number | 'all'
}
