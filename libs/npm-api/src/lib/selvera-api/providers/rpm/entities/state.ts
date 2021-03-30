import { AccountFullData, AccountRef } from '../../account/entities'
import { Entity } from '../../common/entities'
import { RPMStateConditions } from './conditions'
import { RPMDiagnosis } from './rpmDiagnosis'
import { RPMPlan } from './rpmPlan'

/**
 * RPM State
 */
export interface RPMState {
  account: Entity
  conditions: RPMStateConditions
  createdAt: string
  createdBy: AccountFullData
  id: string
  isActive: boolean
  note?: string
  organization: Entity
  plan?: RPMPlan
  reason?: {
    id: string
    description: string
    requiredNote: boolean
    appliesToStateInStatus: any
  }
  startedAt?: string
  supervisingProvider?: AccountRef
  diagnosis?: RPMDiagnosis
}
