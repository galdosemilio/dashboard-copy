export interface OrganizationBillingRecord {
  basePricing?: number
  churnDate?: string
  isPaying: boolean
  payingStartDate?: string
  plan: {
    id: string
    name: string
    description?: string
  }
  renewalDate?: string
  rpmPatientPricing?: number
}
