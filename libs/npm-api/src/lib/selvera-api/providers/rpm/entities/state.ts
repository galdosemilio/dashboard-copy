import { Entity } from '../../common/entities'
import { RPMStateConditions } from './conditions'

/**
 * RPM State
 */
export interface RPMState {
  account: Entity
  conditions: RPMStateConditions
  createdAt: string
  createdBy: Entity
  id: string
  isActive: boolean
  organization: Entity
}
