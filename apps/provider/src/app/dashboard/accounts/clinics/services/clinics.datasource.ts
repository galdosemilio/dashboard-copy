import { MatPaginator, MatSort } from '@coachcare/material'
import { Observable } from 'rxjs'

import { NotifierService } from '@app/service'
import { TableDataSource } from '@app/shared'
import {
  OrgAccesibleSort,
  OrgAccessResponse,
  OrganizationAccess
} from '@coachcare/sdk'
import { ClinicCriteria } from './clinics.criteria'
import { ClinicsDatabase } from './clinics.database'

export class ClinicsDataSource extends TableDataSource<
  OrganizationAccess,
  OrgAccessResponse,
  ClinicCriteria
> {
  totalCount: number

  constructor(
    protected notify: NotifierService,
    protected database: ClinicsDatabase,
    private paginator?: MatPaginator,
    private sort?: MatSort
  ) {
    super()

    // listen the paginator events
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        offset: this.pageIndex * this.pageSize,
        limit: this.pageSize
      }))
    }

    // listen the sorter events
    if (this.sort) {
      this.addOptional(this.sort.sortChange, () => ({
        sort: [
          {
            property:
              (this.sort.active as OrgAccesibleSort['property']) || 'name',
            dir: (this.sort.direction as OrgAccesibleSort['dir']) || 'asc'
          }
        ]
      }))
    }
  }

  defaultFetch(): OrgAccessResponse {
    return { data: [], pagination: { totalCount: 0 } }
  }

  fetch(criteria: ClinicCriteria): Observable<OrgAccessResponse> {
    return this.database.fetch(criteria)
  }

  mapResult(result: OrgAccessResponse): Array<OrganizationAccess> {
    this.totalCount = result.pagination.totalCount
    // pagination handling
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset + result.data.length

    return result.data
  }
}
