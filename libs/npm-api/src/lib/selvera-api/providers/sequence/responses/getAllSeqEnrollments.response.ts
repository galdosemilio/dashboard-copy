import { SequenceEntity } from '../entities'

interface EnrollmentAccount {
  id: string
  firstName: string
  lastName: string
}

/**
 * Interface for GET /sequence/enrollment
 */

export interface GetAllSeqEnrollmentsResponse {
  /** Account Object */
  account: EnrollmentAccount
  /** Creation timestamp */
  createdAt: string
  /** Enrollment ID */
  id: string
  /** A flag indicating if the Enrollment is active */
  isActive: boolean
  /** Sequence information */
  sequence: SequenceEntity
}
