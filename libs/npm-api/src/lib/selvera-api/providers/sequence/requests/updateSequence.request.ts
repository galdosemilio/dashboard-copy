/**
 * Interface for PATCH /sequence/:id
 */

import { SequenceEnrollmentSettings } from '../entities'

export interface UpdateSequenceRequest {
  enrollmentOnAssociation?: boolean
  /** Settings to configure the behavior of patient enrollments for this sequence */
  enrollment?: SequenceEnrollmentSettings | null
  /** ID of the Sequence to be updated */
  id: string
  /** A flag indicating if the Sequence is active */
  isActive?: boolean
  /** Name of the Sequence */
  name?: string
  /** Organization ID */
  organization: string
}
