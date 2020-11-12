interface SortingOption {
  property: 'name' | 'startedAt'
  dir: 'asc' | 'desc'
}

/**
 * Interface for GET /warehouse/patient-listing/enrollment
 */

export interface FetchPatientListingPackageEnrollmentsRequest {
  account: string
  limit?: number | 'all'
  offset?: number
  organization: string
  sort?: SortingOption[]
}
