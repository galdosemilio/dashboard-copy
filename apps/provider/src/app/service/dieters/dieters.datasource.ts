import { MatPaginator, MatSort } from '@coachcare/material'
import { find } from 'lodash'
import { from, Observable } from 'rxjs'

import { NotifierService } from '@app/service'
import { TableDataSource } from '@app/shared/model'
import {
  AccAccesibleSort,
  AccListResponse,
  AccountAccessData
} from '@coachcare/sdk'
import { DietersCriteria } from './dieters.criteria'
import { DietersDatabase } from './dieters.database'

export class DietersDataSource extends TableDataSource<
  AccountAccessData,
  AccListResponse,
  DietersCriteria
> {
  constructor(
    protected notify: NotifierService,
    protected database: DietersDatabase,
    private paginator?: MatPaginator,
    private sort?: MatSort
  ) {
    super()

    // listen the paginator events
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        pageSize: this.paginator.pageSize,
        offset: this.paginator.pageIndex * this.paginator.pageSize
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

  fetch(criteria): Observable<AccListResponse> {
    return from(this.database.fetchAll(criteria))
  }

  mapResult(result: AccListResponse): Array<AccountAccessData> {
    // pagination handling
    this.getTotal(result)

    if (result.data.length === 0) {
      return []
    }

    return result.data.map((v) => ({
      ...v,
      association: find(v.organizations, {
        accessType: 'association'
      })
    }))
  }
}
