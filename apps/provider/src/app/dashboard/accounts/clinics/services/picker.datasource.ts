import { MatPaginator, MatSort } from '@coachcare/common/material'
import { combineLatest, Observable } from 'rxjs'

import { NotifierService } from '@app/service'
import { TableDataSource } from '@app/shared'
import {
  OrgAccesibleSort,
  OrgAccessResponse,
  OrganizationAccess
} from '@coachcare/npm-api'
import { ClinicCriteria } from './clinics.criteria'
import { ClinicsDatabase } from './clinics.database'

export class ClinicPickerDataSource extends TableDataSource<
  OrganizationAccess,
  Array<OrgAccessResponse>,
  ClinicCriteria
> {
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

  defaultFetch(): Array<OrgAccessResponse> {
    return [
      { data: [], pagination: {} },
      { data: [], pagination: {} }
    ]
  }

  fetch(criteria: ClinicCriteria): Observable<Array<OrgAccessResponse>> {
    const sources: Array<Observable<OrgAccessResponse>> = []

    if (!criteria.newAccount) {
      // fetch the coach associated orgs
      sources.push(
        this.database.fetch({
          ...criteria,
          strict: true
        })
      )
    }
    if (!criteria.pickedOnly) {
      sources.push(
        this.database.fetch({
          ...criteria,
          strict: false,
          account: undefined
        })
      )
    }

    return combineLatest(sources)
  }

  mapResult(result: Array<OrgAccessResponse>): Array<OrganizationAccess> {
    const data = result[1] || result[0]

    // pagination handling
    this.total = data.pagination.next
      ? data.pagination.next + 1
      : this.criteria.offset + data.data.length

    if (result[1]) {
      return result[0].data.concat(result[1].data.filter((v) => !v.isDirect))
    }

    return result[0].data
  }
}
