import { Entity } from '../../common/entities'
import { LoclessSequenceTrigger } from './sequenceTrigger'

export interface TriggerHistoryItem {
  /** Account Entity */
  account: Entity
  /** History entry creation timestamp */
  createdAt: string
  /** Trigger history ID */
  id: string
  /** Locale saved on execution */
  locale?: string
  /** Organization Entity */
  organization: Entity
  /** Executed payload */
  payload: any
  /** Trigger information */
  trigger: LoclessSequenceTrigger
}
