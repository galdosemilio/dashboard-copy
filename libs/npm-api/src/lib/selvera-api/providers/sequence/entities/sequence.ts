import { SequenceAssociation } from './sequenceAssociation'
import { SequenceAutoEnrollmentOptions } from './sequenceAutoEnrollment'

export interface SequenceEntity {
  /** Sequence Asssociation options */
  association: SequenceAssociation
  /** Autoenrollment options */
  autoEnrollment?: SequenceAutoEnrollmentOptions
  /** Sequence ID */
  id: string
  /** Sequence name */
  name: string
}
