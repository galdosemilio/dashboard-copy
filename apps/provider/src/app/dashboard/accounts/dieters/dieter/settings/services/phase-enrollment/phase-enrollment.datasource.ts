import { PhaseEnrollmentDatabase } from './phase-enrollment.database'
import { from, Observable } from 'rxjs'
import {
  GetAllPackageEnrollmentRequest,
  GetAllPackageEnrollmentResponse,
  PackageEnrollmentSegment
} from '@coachcare/sdk'
import { MatPaginator } from '@coachcare/material'
import { TableDataSource } from '@app/shared'

export class PhaseEnrollmentDataSource extends TableDataSource<
  PackageEnrollmentSegment,
  GetAllPackageEnrollmentResponse,
  GetAllPackageEnrollmentRequest
> {
  constructor(
    protected database: PhaseEnrollmentDatabase,
    private paginator?: MatPaginator
  ) {
    super()

    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        offset: this.paginator.pageIndex * (this.paginator.pageSize || 10),
        limit: this.paginator.pageSize
      }))
    }
  }

  defaultFetch(): GetAllPackageEnrollmentResponse {
    return { data: [], pagination: {} }
  }

  fetch(
    criteria: GetAllPackageEnrollmentRequest
  ): Observable<GetAllPackageEnrollmentResponse> {
    return from(this.database.fetch(criteria))
  }

  mapResult(
    result: GetAllPackageEnrollmentResponse
  ): PackageEnrollmentSegment[] {
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset !== undefined
      ? this.criteria.offset + result.data.length
      : 0

    return result.data
  }
}
