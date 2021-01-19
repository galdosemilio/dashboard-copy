import { NamedEntity } from '../../common/entities'

export interface OrganizationBillingRecord {
  basePricing?: number
  churnDate?: string
  entity?: {
    isBillable?: boolean
    type: NamedEntity
  }
  isPaying: boolean
  numberOfLocations?: number
  payingStartDate?: string
  plan?: {
    id: string
    name: string
    description?: string
  }
  renewalDate?: string
  rpmPatientPricing?: number
  reportEndDate?: string
}
