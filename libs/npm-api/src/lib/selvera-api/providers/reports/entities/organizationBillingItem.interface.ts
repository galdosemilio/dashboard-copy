import { NamedEntity } from '../../common/entities'

export interface BillingOrganizationEntity {
  id: string
  name: string
  hierarchyPath: string[]
  isActive: boolean
}

export interface BillingUserCount {
  count: number
}

export interface BillingUserActivity {
  active: BillingUserCount
  registered: BillingUserCount
}

export interface OrganizationBillingItem {
  organization: BillingOrganizationEntity
  parent?: BillingOrganizationEntity
  patients: {
    lastThreeMonths: {
      active: BillingUserCount
      registered: BillingUserCount
    }
    rpm: BillingUserCount
    total: {
      registered: BillingUserCount
    }
  }
  providers: BillingUserActivity
  videoCalls?: {
    twilio: BillingUserCount
  }
  plan?: {
    id: string
    name: string
  }
  entity?: {
    isBillable?: boolean
    type: NamedEntity
  }
  pricing: {
    base: number
    rpmPatient: number
    nonRpmPatient?: number
  }
  isPaying?: boolean
  registrationDate?: string
  churnDate?: string
  payingStartDate?: string
  renewalDate?: string
  numberOfLocations?: number
  reportEndDate?: string
}
