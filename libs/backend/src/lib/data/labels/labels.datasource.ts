import { Injectable } from '@angular/core'
import { SearchDataSource } from '@coachcare/backend/model'
import {
  GetAllPackageRequest,
  GetAllPackageResponse,
  PackageSingle
} from '@coachcare/sdk'
import { _, AutocompleterOption } from '@coachcare/backend/shared'
import { Observable } from 'rxjs'
import { LabelsDatabase } from './labels.database'

@Injectable()
export class LabelsDataSource extends SearchDataSource<
  PackageSingle,
  GetAllPackageResponse,
  GetAllPackageRequest
> {
  constructor(protected database: LabelsDatabase) {
    super()
  }

  defaultFetch(): GetAllPackageResponse {
    return {
      data: [],
      pagination: {}
    }
  }

  fetch(criteria: GetAllPackageRequest): Observable<GetAllPackageResponse> {
    return this.database.fetch(criteria)
  }

  search(query: string, limit: number) {
    // custom search parameters
    this.refresh({ limit })
  }

  mapResult(result: GetAllPackageResponse): Array<PackageSingle> {
    // pagination handling
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset !== undefined
      ? this.criteria.offset + result.data.length
      : 0

    return result.data
  }

  mapSearch(result: Array<PackageSingle>): Array<AutocompleterOption> {
    // search handling
    return result.map((pkg) => ({
      value: this.getRoute(pkg),
      viewValue: `${pkg.title}`,
      viewSubvalue: _('GLOBAL.LABEL')
    }))
  }

  private getRoute(pkg) {
    return `/labels/${pkg.id}`
  }
}
