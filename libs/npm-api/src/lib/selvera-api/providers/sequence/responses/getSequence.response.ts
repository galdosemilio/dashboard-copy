import { Entity, NamedEntity } from '../../common/entities'
import {
  SequenceAssociation,
  SequenceAutoEnrollmentOptions,
  SequenceState,
  SequenceTransition
} from '../entities'

/**
 * Interface for GET /sequence
 */

export interface GetSequenceResponse {
  /** Organization Association */
  association: SequenceAssociation
  /** Autoenrollment options */
  autoenrollment?: SequenceAutoEnrollmentOptions
  /** Creator user Entity */
  createdBy: Entity
  enrollmentOnAssociation?: boolean
  /** Sequence ID */
  id: string
  /** A flag indicating if the sequence is active */
  isActive: string
  /** Sequence name */
  name: string
  /** Sequence State collection. Only present if full = true */
  states?: SequenceState[]
  /** Sequence Transition collection. Only present if full = true */
  transitions?: SequenceTransition[]
  organization?: NamedEntity
}
