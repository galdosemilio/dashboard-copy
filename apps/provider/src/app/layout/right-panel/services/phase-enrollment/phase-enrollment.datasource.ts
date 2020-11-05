import { TableDataSource } from '@app/shared'
import {
  GetAllPackageEnrollmentRequest,
  GetAllPackageEnrollmentResponse,
  PackageEnrollmentSegment
} from '@coachcare/npm-api'
import { from, Observable } from 'rxjs'
import { PhaseEnrollmentDatabase } from '..'

export class PhaseEnrollmentDataSource extends TableDataSource<
  PackageEnrollmentSegment,
  GetAllPackageEnrollmentResponse,
  GetAllPackageEnrollmentRequest
> {
  public next: number

  constructor(protected database: PhaseEnrollmentDatabase) {
    super()
  }

  public defaultFetch(): GetAllPackageEnrollmentResponse {
    return { data: [], pagination: {} }
  }

  public fetch(criteria: any): Observable<GetAllPackageEnrollmentResponse> {
    return from(this.database.fetch(criteria))
  }

  public mapResult(
    result: GetAllPackageEnrollmentResponse
  ): PackageEnrollmentSegment[] {
    this.next = result.pagination.next || 0
    return result.data
  }
}
