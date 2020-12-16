import { RPMStateConditions } from '../entities'

/**
 * Interface for POST /rpm/state
 */
interface StateRequest {
  account: string
  organization: string
  note?: string
}

type ActiveStateCreationRequest = StateRequest & {
  isActive: true
  conditions: RPMStateConditions
  plan?: string
  targetDeactivationDate?: string
}

type InactiveStateCreationRequest = StateRequest & {
  isActive: false
  conditions?: RPMStateConditions
  reason: string
}

export type CreateRPMStateRequest =
  | ActiveStateCreationRequest
  | InactiveStateCreationRequest
