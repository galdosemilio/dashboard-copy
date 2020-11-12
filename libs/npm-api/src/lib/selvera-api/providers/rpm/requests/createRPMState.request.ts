import { RPMStateConditions } from '../entities'

/**
 * Interface for POST /rpm/state
 */
interface StateRequest {
  account: string
  organization: string
}

type ActiveStateCreationRequest = StateRequest & {
  isActive: true
  conditions: RPMStateConditions
}

type InactiveStateCreationRequest = StateRequest & {
  deactivationReason: string
  isActive: false
  conditions?: RPMStateConditions
}

export type CreateRPMStateRequest =
  | ActiveStateCreationRequest
  | InactiveStateCreationRequest
