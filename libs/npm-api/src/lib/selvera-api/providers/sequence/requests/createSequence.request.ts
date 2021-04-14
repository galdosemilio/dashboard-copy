import { AssociationOptions, SequenceEnrollmentSettings } from '../entities'

/**
 * Interface for POST /sequence
 */

export interface CreateSequenceRequest {
  /** Organization association options */
  association?: AssociationOptions
  /** The ID of the user creating the Sequence */
  createdBy: string
  enrollmentOnAssociation?: boolean
  /** Settings to configure the behavior of patient enrollments for this sequence */
  enrollment?: SequenceEnrollmentSettings
  /** A flag indicating if the sequence is active */
  isActive?: boolean
  /** Name of the sequence */
  name: string
  /** Organization ID */
  organization: string
}
