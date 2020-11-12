interface TruncatedOrgListItem {
  id: string
  name: string
  changedAt: string
}

interface TruncatedPackageListItem {
  id: string
  name: string
  startedAt: string
}

interface WeightEntry {
  id: string
  recordedAt: {
    utc: string
    local: string
    timezone: string
  }
  value: number
}

export interface PatientListingItem {
  account: {
    id: string
    firstName: string
    lastName: string
    email: string
    startedAt?: string
  }
  organizations: {
    data: TruncatedOrgListItem[]
    count: number
  }
  packages: {
    data: TruncatedPackageListItem[]
    count: number
  }
  weight?: {
    change: {
      value: number
      percentage: number
    }
    first: WeightEntry
    last: WeightEntry
  }
}
