/**
 * Interface for GET /sequence/enrollment/audit
 */

export interface GetAllSeqEnrollmentsRequest {
  /** Account ID */
  account: string
  /** Page size */
  limit?: number | 'all'
  /** Page offset */
  offset?: number | 'all'
  /** Organization ID */
  organization: string
  /** Sequence ID */
  sequence: string
}
