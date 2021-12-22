import { Injectable } from '@angular/core'
import { MatPaginator } from '@coachcare/material'
import { NotifierService } from '@app/service'
import { TableDataSource } from '@app/shared/model'
import { _ } from '@app/shared/utils'
import {
  FetchPackagesSegment,
  GetAllPackageOrganizationRequest,
  PackageEnrollmentSegment
} from '@coachcare/sdk'
import { Observable } from 'rxjs'
import { PhasesDatabase, PackagesAndEnrollments } from './phases.database'

export type PhasesDataSegment = {
  id: string | null
  package: FetchPackagesSegment
  inherited: boolean
  status: string
  enrolled: boolean
  history: { start: string; end: string }
}

const DEFAULT_ENROLLMENT_ENTRY: PhasesDataSegment = Object.freeze({
  id: null,
  inherited: false,
  status: _('PHASE.NEVER_ENROLLED'),
  enrolled: false,
  history: { start: '', end: '' },
  package: null
})

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
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset !== undefined
      ? this.criteria.offset + result.data.length
      : 0

    this.enrollments = result.enrollments.data

    return result.data.map((pkg) => {
      const mostRecentEnrollment = this.enrollments
        .filter((e) => pkg.id === e.package.id)
        .shift()

      let enrollmentStatus = _('PHASE.NEVER_ENROLLED')

      if (mostRecentEnrollment) {
        enrollmentStatus = mostRecentEnrollment.isActive
          ? _('PHASE.CURRENTLY_ENROLLED')
          : _('PHASE.PREVIOUSLY_ENROLLED')
      }

      return {
        ...DEFAULT_ENROLLMENT_ENTRY,
        id: mostRecentEnrollment?.id ?? '',
        inherited: pkg.organization.id !== this.criteria.organization,
        enrolled: mostRecentEnrollment?.isActive ?? false,
        status: enrollmentStatus,
        history: {
          start: mostRecentEnrollment?.enroll.start ?? '',
          end: mostRecentEnrollment?.enroll.end ?? ''
        },
        package: pkg
      }
    })
  }

  postResult(result: Array<PhasesDataSegment>): Array<PhasesDataSegment> {
    this.showMarker = result.some((v) => v.inherited)

    return result
  }
}
