import { Entity } from '../../common/entities'
import { SequenceEntity } from './sequence'

export interface ProjectedTransition {
  /** Account ID */
  account: Entity
  /** Transition creation timestamp */
  createdAt: string
  /** Transition creator user Entity */
  createdBy: Entity
  /** Transition delay */
  delay?: number
  /** Transition ID */
  id: string
  /** Source State Entity */
  from?: Entity
  /** Organization Entity */
  organization: Entity
  /** Sequence Entity */
  sequence: SequenceEntity
  /** Target State Entity */
  to: Entity
  /** Projected transition timestamp */
  transitionAt: string
}
