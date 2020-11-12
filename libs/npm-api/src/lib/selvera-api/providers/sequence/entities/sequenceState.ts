import { Entity } from '../../common/entities'

export interface SequenceState {
  /** State ID */
  createdAt: string
  /** State creator Entity */
  createdBy: Entity
  /** State ID */
  id: string
  /** State name */
  name: string
}
