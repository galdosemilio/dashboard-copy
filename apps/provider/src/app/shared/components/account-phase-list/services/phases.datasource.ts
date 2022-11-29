import { Injectable } from '@angular/core'
import { MatPaginator } from '@coachcare/material'
import { NotifierService } from '@app/service'
import { TableDataSource } from '@app/shared/model'
import {
  GetAllPackageOrganizationRequest,
  PackageEnrollmentSegment
} from '@coachcare/sdk'
import { Observable } from 'rxjs'
import { PhasesDatabase, PackagesAndEnrollments } from './phases.database'
import { PhasesDataSegment, Phase } from './utils'

@Injectable()
export class PhasesDataSource extends TableDataSource<
  PhasesDataSegment,
  PackagesAndEnrollments,
  GetAllPackageOrganizationRequest
> {
  enrollments: PackageEnrollmentSegment[] = []
  showMarker: boolean

  constructor(
    protected notify: NotifierService,
    protected database: PhasesDatabase,
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

  defaultFetch(): PackagesAndEnrollments {
    return {
      data: [],
      pagination: {},
      enrollments: {
        data: [],
        pagination: {}
      }
    }
  }

  fetch(
    criteria: GetAllPackageOrganizationRequest
  ): Observable<PackagesAndEnrollments> {
    return this.database.fetch(criteria)
  }

  mapResult(result: PackagesAndEnrollments): Array<PhasesDataSegment> {
    this.getTotal(result)

    this.enrollments = result.enrollments.data

    return result.data.map((pkg) => {
      const mostRecentEnrollment = this.enrollments
        .filter((e) => pkg.id === e.package.id)
        .shift()

      return Phase.createPhaseDataSegment(
        pkg,
        mostRecentEnrollment,
        this.criteria.organization
      )
    })
  }

  postResult(result: Array<PhasesDataSegment>): Array<PhasesDataSegment> {
    this.showMarker = result.some((v) => v.inherited)

    return result
  }
}
