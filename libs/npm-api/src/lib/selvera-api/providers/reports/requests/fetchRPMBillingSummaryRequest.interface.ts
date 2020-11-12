export interface RPMBillingSummarySort {
  property: 'anyCodeLastEligibleAt'
  dir?: 'asc' | 'desc'
}

export interface FetchRPMBillingSummaryRequest {
  account?: string
  asOf?: string
  organization: string
  limit?: number | 'all'
  offset?: number
  sort?: RPMBillingSummarySort[]
  status?: 'active' | 'inactive' | 'all'
}
