import { PackageFilter } from '@app/shared/components/package-filter'
import { AccListRequest } from '@coachcare/sdk'

export interface DietersCriteria extends AccListRequest {
  pageSize: number | 'all'
}

export interface PatientsFilters {
  page?: number
  pageSize?: number
  expires?: Date
  organization?: string
  packages?: PackageFilter
}
