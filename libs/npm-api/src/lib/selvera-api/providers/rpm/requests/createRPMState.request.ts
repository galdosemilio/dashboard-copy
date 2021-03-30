import { RPMDiagnosis, RPMStateConditions } from '../entities'

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
  diagnosis: RPMDiagnosis
  plan?: string
  supervisingProvider: string
  targetDeactivationDate?: string
}

type InactiveStateCreationRequest = StateRequest & {
  isActive: false
  conditions?: RPMStateConditions
  reason: string
  note?: string
}

export type CreateRPMStateRequest =
  | ActiveStateCreationRequest
  | InactiveStateCreationRequest
