import { Injectable } from '@angular/core';
import { MatPaginator, MatSort } from '@coachcare/common/material';
import { NotifierService } from '@app/service';
import { _, TableDataSource } from '@app/shared';
import {
  FetchPackagesSegment,
  GetAllPackageOrganizationRequest,
} from '@app/shared/selvera-api';
import { find } from 'lodash';
import { Observable } from 'rxjs';
import { LabelsDatabase, PackagesAndEnrollments } from './labels.database';

export type LabelsDataSegment = {
  id: string | null;
  package: FetchPackagesSegment;
  inherited: boolean;
  status: string;
  enrolled: string | null;
  active: string | null;
  // history: any;
};

@Injectable()
export class LabelsDataSource extends TableDataSource<
  LabelsDataSegment,
  PackagesAndEnrollments,
  GetAllPackageOrganizationRequest
> {
  enrollments: any[] = [];
  showMarker: boolean;

  constructor(
    protected notify: NotifierService,
    protected database: LabelsDatabase,
    private paginator?: MatPaginator,
    private sort?: MatSort
  ) {
    super();

    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        offset: this.paginator.pageIndex * (this.paginator.pageSize || 10),
        limit: this.paginator.pageSize,
      }));
    }
  }

  defaultFetch(): PackagesAndEnrollments {
    return {
      data: [],
      pagination: {},
      enrollments: {
        data: [],
        pagination: {},
      },
    };
  }

  fetch(
    criteria: GetAllPackageOrganizationRequest
  ): Observable<PackagesAndEnrollments> {
    return this.database.fetch(criteria);
  }

  mapResult(result: PackagesAndEnrollments): Array<LabelsDataSegment> {
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset !== undefined
      ? this.criteria.offset + result.data.length
      : 0;

    const active = find(result.enrollments.data, { isActive: true });

    this.enrollments = result.enrollments.data;

    return result.data.map((pkg) => {
      const pkgEnrolls = result.enrollments.data.filter(
        (e) => pkg.id === e.package
      );

      let status = _('PHASE.NEVER_ENROLLED');
      let enrolled = null;
      for (const e of pkgEnrolls) {
        if (e.isActive) {
          enrolled = e.id;
        }
        status = enrolled
          ? _('PHASE.CURRENTLY_ENROLLED')
          : _('PHASE.PREVIOUSLY_ENROLLED');
      }

      return {
        id: active ? active.id : null,
        package: pkg,
        inherited: pkg.organization.id !== this.criteria.organization,
        status,
        enrolled,
        active: active ? active.id : null,
        // history: {
        //   start: pkgEnrolls.map(p => moment(p.startDate).format('LL')),
        //   end: pkgEnrolls.map(p => (p.endDate ? moment(p.endDate).format('LL') : '-')),
        //   actions: pkgEnrolls.map(p => (p.isActive ? false : true)),
        //   enrollments: pkgEnrolls
        // }
      };
    });
  }

  postResult(result: Array<LabelsDataSegment>): Array<LabelsDataSegment> {
    this.showMarker = result.some((v) => v.inherited);

    return result;
  }
}
