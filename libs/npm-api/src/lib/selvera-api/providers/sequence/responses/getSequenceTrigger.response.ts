import { NamedEntity } from '../../common/entities'
import { SequenceEntity, TriggerLocalization } from '../entities'

/**
 * Interface for GET /sequence/trigger/:id
 */

export interface GetSequenceTriggerResponse {
  /** Trigger creation timestamp */
  createdAt: string
  /** Trigger ID */
  id: string
  /** Locale-specific Trigger contents */
  localizations: TriggerLocalization[]
  /** Trigger payload. Structure depends on the Trigger type */
  payload: any
  /** Sequence Entity */
  sequence: SequenceEntity
  /** Trigger type Named Entity */
  type: NamedEntity
  /** Trigger last update timestamp */
  updatedAt?: string
}
