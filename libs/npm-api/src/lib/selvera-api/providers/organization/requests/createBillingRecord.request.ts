/**
 * Interface for POST /organization/:organization/billing
 */

export interface CreateBillingRecordRequest {
  basePricing?: number
  churnDate?: string
  isPaying: boolean
  organization: string
  payingStartDate?: string
  plan?: string
  renewalDate?: string
  rpmPatientPricing?: number
}
