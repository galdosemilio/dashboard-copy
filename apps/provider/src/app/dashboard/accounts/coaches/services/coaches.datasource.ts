import { MatPaginator, MatSort } from '@coachcare/material'
import { find } from 'lodash'
import { Observable } from 'rxjs'

import { NotifierService } from '@app/service/notifier.service'
import { TableDataSource } from '@app/shared'
import {
  AccAccesibleSort,
  AccListResponse,
  AccountAccessData
} from '@coachcare/sdk'
import { CoachesCriteria } from './coaches.criteria'
import { CoachesDatabase } from './coaches.database'

export class CoachesDataSource extends TableDataSource<
  AccountAccessData,
  AccListResponse,
  CoachesCriteria
> {
  totalCount: number

  constructor(
    protected notify: NotifierService,
    protected database: CoachesDatabase,
    private paginator?: MatPaginator,
    private sort?: MatSort
  ) {
    super()

    // listen the paginator events
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        offset: this.paginator.pageIndex * this.paginator.pageSize,
        limit: this.paginator.pageSize
      }))
    }

    // listen the sorter events
    if (this.sort) {
      this.addOptional(this.sort.sortChange, () => ({
        sort: [
          {
            property: this.sort.active
              ? (this.sort.active as AccAccesibleSort['property'])
              : ('firstName' as AccAccesibleSort['property']),
            dir: (this.sort.direction as AccAccesibleSort['dir']) || 'asc'
          }
        ]
      }))
    }
  }

  defaultFetch(): AccListResponse {
    return { data: [], pagination: { totalCount: 0 } }
  }

  fetch(criteria: CoachesCriteria): Observable<AccListResponse> {
    return this.database.fetchAll(criteria)
  }

  mapResult(result: AccListResponse): Array<AccountAccessData> {
    this.totalCount = result.pagination.totalCount

    // pagination handling
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset + result.data.length

    return result.data.map((v) => ({
      ...v,
      association: find(v.organizations, {
        accessType: 'association'
      })
    }))
  }
}
