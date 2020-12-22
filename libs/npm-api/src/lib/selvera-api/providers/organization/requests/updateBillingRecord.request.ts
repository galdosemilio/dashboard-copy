/**
 * Interface for PATCH /organization/:organization/billing
 */

export interface UpdateBillingRecordRequest {
  basePricing?: boolean
  churnDate?: string
  entity?: {
    isBillable?: boolean
    type: string
  }
  isPaying?: boolean
  rpmPatientPricing?: boolean
  payingStartDate?: string
  plan?: string
  organization: string
  renewalDate?: string
}
