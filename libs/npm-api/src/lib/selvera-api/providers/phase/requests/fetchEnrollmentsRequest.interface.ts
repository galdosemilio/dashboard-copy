/**
 * Interface for GET /package/enrollment (request)
 */

export interface FetchEnrollmentsRequest {
  account?: number | string | Array<number> | Array<string>
  organization?: number | string
  package?: number | string
  sortProperty?: 'enroll_start' | 'enroll_end' | 'first_name' | 'last_name'
  sortDirection?: 'asc' | 'desc'
  active?: boolean
  offset?: number
  limit?: number
  paginate?: boolean
}
