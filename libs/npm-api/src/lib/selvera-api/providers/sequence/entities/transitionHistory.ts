import { Entity } from '../../common/entities'
import { SequenceEntity } from './sequence'

export interface TransitionHistory {
  /** Account Entity */
  account: Entity
  /** Creation timestamp */
  createdAt: string
  /** Creator user Entity */
  createdBy: Entity
  /** Transition History entry ID */
  id: string
  /** Source State Entity */
  from?: Entity
  /** Organization Entity */
  organization: Entity
  /** Sequence Entity */
  sequence: SequenceEntity
  /** Target State Entity */
  to: Entity
}
