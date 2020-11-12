/**
 * Interface for POST /sequence/enrollment/inactive
 */

export interface CreateInactiveSeqEnrollmentRequest {
  /** Account ID */
  account: string
  /** Creator account ID */
  createdBy: string
  /** Sequence ID */
  sequence: string
}
