/**
 * Interface for GET /sequence/enrollment
 */

export interface GetTimeframedSeqEnrollmentsRequest {
  /** Account ID */
  account?: string
  /** A timestamp that indicates as of which point in time the list should be retrieved */
  asOf?: string
  /** Page size */
  limit?: number | 'all'
  /** Page offset */
  offset?: number
  /** Organization ID */
  organization: string
  /** Sequence ID */
  sequence: string
  /** Status filter */
  status?: 'active' | 'inactive' | 'all'
}
