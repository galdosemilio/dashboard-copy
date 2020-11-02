import { Entity } from '../../common/entities'
import { SequenceTrigger } from './sequenceTrigger'

export interface SequenceTransition {
  /** Transition creation timestamp */
  createdAt: string
  /** Transition creator Entity */
  createdBy: Entity
  /** Transition delay */
  delay?: string
  /** Transition ID */
  id: string
  /** Source transition State */
  from?: Entity
  /** Target transition State */
  to: Entity
  /** Triggers attached to the Transition */
  triggers: SequenceTrigger[]
}
