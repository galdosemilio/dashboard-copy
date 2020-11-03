import { Entity } from '../../common/entities'
import { SequenceEntity, SequenceTrigger } from '../entities'

/**
 * Interface for GET /sequence/transition/:id
 */

export interface GetSeqTransitionResponse {
  /** Creation timestamp */
  createdAt: string
  /** Transition creator ID */
  createdBy: Entity
  /** Transition delay */
  delay?: string
  /** Source State Entity */
  from?: Entity
  /** Transition ID */
  id: string
  /** Sequence Entity */
  sequence: SequenceEntity
  /** Target State Entity */
  to: Entity
  /** Triggers attached to the Transitions */
  triggers: SequenceTrigger[]
}
