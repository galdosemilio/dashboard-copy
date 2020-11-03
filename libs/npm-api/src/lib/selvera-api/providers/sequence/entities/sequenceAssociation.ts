import { Entity } from '../../common/entities'

export interface SequenceAssociation {
  /** Association creation timestamp */
  createdAt: string
  /** Association creator Entity */
  createdBy: Entity
  /** Association ID */
  id: string
  /** A flag indicating if the Sequence association is active */
  isActive: boolean
  /** Organization Entity */
  organization: Entity
}
