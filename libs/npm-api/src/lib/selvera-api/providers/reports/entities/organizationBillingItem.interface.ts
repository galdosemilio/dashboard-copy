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
    active: BillingUserCount
    registered: BillingUserCount
    rpm: BillingUserCount
  }
  providers: BillingUserActivity
  videoCalls?: {
    twilio: BillingUserCount
  }
  plan?: {
    id: string
    name: string
  }
  pricing: {
    base: number
    rpmPatient: number
  }
  isPaying?: boolean
  registrationDate?: string
  churnDate?: string
  payingStartDate?: string
  renewalDate?: string
}
