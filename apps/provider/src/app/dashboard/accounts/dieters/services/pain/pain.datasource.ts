import { MatPaginator } from '@coachcare/material'
import { NotifierService } from '@app/service'
import { TableDataSource } from '@app/shared'
import { find, sortBy } from 'lodash'
import * as moment from 'moment'
import { Observable } from 'rxjs'
import { PainData } from './pain.data'
import {
  GetAllPainRequest,
  GetAllPainResponse,
  PainDatabase
} from './pain.database'

export class PainDataSource extends TableDataSource<
  PainData,
  GetAllPainResponse,
  GetAllPainRequest
> {
  constructor(
    protected notify: NotifierService,
    protected database: PainDatabase,
    protected paginator?: MatPaginator
  ) {
    super()
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize || this.pageSize,
        offset:
          (this.paginator.pageIndex || this.pageIndex) *
          (this.paginator.pageSize || this.pageSize)
      }))
    }
  }

  defaultFetch(): GetAllPainResponse {
    return { data: [], pagination: {} }
  }

  fetch(criteria: GetAllPainRequest): Observable<GetAllPainResponse> {
    return this.database.fetchAll(criteria)
  }

  mapResult(result: GetAllPainResponse): PainData[] {
    // pagination update
    this.total = this.getTotal(result)

    // group the registries per date in the datasource
    const rows: Array<PainData> = []
    result.data.map((line) => {
      let row = find(
        rows,
        (v) => v.date === moment(line.reportedAt).format('YYYY-MM-DD')
      )
      if (row) {
        row.addRow(line)
      } else {
        row = new PainData(line)
        rows.push(row)
      }
    })

    return sortBy(rows, 'date').reverse()
  }
}
