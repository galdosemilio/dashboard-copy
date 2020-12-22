/**
 * Interface for POST /organization/:organization/billing
 */

export interface CreateBillingRecordRequest {
  basePricing?: number
  churnDate?: string
  entity?: {
    type: string
    isBillable?: boolean
  }
  isPaying: boolean
  organization: string
  payingStartDate?: string
  plan?: string
  renewalDate?: string
  rpmPatientPricing?: number
}
