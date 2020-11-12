/**
 * Interface for GET /conference/video/call
 */

export interface FetchCallsRequest {
  account?: string
  /**
   * @deprecated use 'status' instead
   */
  inProgress?: boolean
  organization: string
  status?: 'in-progress' | 'ended'
  limit?: number | 'all'
  offset?: number
}
