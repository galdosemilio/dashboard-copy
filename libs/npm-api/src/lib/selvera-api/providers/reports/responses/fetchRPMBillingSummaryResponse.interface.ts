import { OrganizationWithoutShortcode } from '../../organization/entities'

export interface AccountData {
  dateOfBirth: string
  firstName: string
  id: string
  lastName: string
}

export interface CountEntity {
  count: number
}

export interface RPMStateSummaryElapsedMetric {
  seconds: {
    elapsed: number
  }
}

export interface RPMStateSummaryBillingItem {
  code: string
  eligibility: {
    last: {
      count: number
      timestamp: string
    }
    next?: {
      alreadyEligibleCount: number
      earliestEligibleAt: string
      relatedCodeRequirementsNotMet?: string[]
      liveInteraction?: {
        count: number
        lastOverride?: string
        required: number
      }
      monitoring?: {
        remaining?: number
        automated: RPMStateSummaryElapsedMetric
        calls: RPMStateSummaryElapsedMetric
        total: {
          seconds: {
            elapsed: number
            required?: number
            tracked?: number
          }
        }
      }
      transmissions?: {
        distinctDates: {
          count: number
          required: number
        }
        measurements: {
          automated: CountEntity
          manual: CountEntity
        }
        notification: CountEntity
      }
    }
  }
}

export interface ActiveRPMItem {
  changedAt: string
  conditions: {
    goalsSet: boolean
    hadFaceToFace: boolean
    hasMedicalNecessity: boolean
    patientConsented: boolean
    receivedDevice: boolean
  }
  consentedAt: string
  deviceProvidedAt: string
  educationProvidedAt: string
  isActive: boolean
  reason?: {
    description: string
    id: string
  }
}

export interface InactiveRPMItem {
  changedAt: string
  deactivationReason?: {
    description: string
    id: string
  }
  reason?: {
    description: string
    id: string
  }
  isActive: false
}

export interface RPMStateSummaryItem {
  account: AccountData
  anyCodeLastEligibleAt?: string
  billing: RPMStateSummaryBillingItem[]
  changedAt?: string
  changedBy?: AccountData
  id: string
  organization: OrganizationWithoutShortcode
  rpm: ActiveRPMItem | InactiveRPMItem
}

export interface FetchRPMBillingSummaryResponse {
  data: RPMStateSummaryItem[]
}
