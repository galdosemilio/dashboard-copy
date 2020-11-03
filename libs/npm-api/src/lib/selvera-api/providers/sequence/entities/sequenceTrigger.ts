import { NamedEntity } from '../../common/entities'
import { TriggerLocalization } from './triggerLocalization'

export interface SequenceTrigger {
  /** Trigger ID */
  id: string
  /** Trigger activity flag */
  isActive?: boolean
  /** Trigger type NamedEntity */
  type: NamedEntity
  /** Trigger creation timestamp */
  createdAt: string
  /** Locale-specific Trigger contents */
  localizations?: TriggerLocalization[]
  /** Trigger contents. Structure depends on the type */
  payload: any
  /** Last update timestamp for the Trigger */
  updatedAt?: string
}

export type LoclessSequenceTrigger = Pick<
  SequenceTrigger,
  'id' | 'type' | 'createdAt' | 'updatedAt' | 'payload'
>
