import { MatSort } from '@coachcare/material'
import { NotifierService } from '@app/service'
import { CcrPaginator } from '@app/shared/components/paginator'
import { TableDataSource } from '@app/shared/model'
import {
  FetchRPMBillingSummaryRequest,
  PagedResponse,
  RPMStateSummaryItem
} from '@coachcare/npm-api'
import { _ } from '@app/shared/utils'
import { from, Observable } from 'rxjs'
import { RPM_CODE_COLUMNS, RPMStateSummaryEntry } from '../rpm/models'
import { ReportsDatabase } from './reports.database'

export class RPMBillingDataSource extends TableDataSource<
  RPMStateSummaryEntry,
  PagedResponse<RPMStateSummaryItem>,
  FetchRPMBillingSummaryRequest
> {
  public totalCount?: number

  constructor(
    protected database: ReportsDatabase,
    protected notify: NotifierService,
    private paginator?: CcrPaginator,
    private sort?: MatSort
  ) {
    super()

    // listen the paginator events
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize,
        offset: this.paginator.pageIndex * this.paginator.pageSize
      }))
    }

    if (this.sort) {
      this.addOptional(this.sort.sortChange, () => ({
        sort: [
          {
            property:
              (this.sort.active as 'anyCodeLastEligibleAt') ||
              'anyCodeLastEligibleAt',
            dir: this.sort.direction || 'asc'
          }
        ]
      }))
    }
  }

  defaultFetch(): PagedResponse<RPMStateSummaryItem> {
    return { data: [], pagination: {} }
  }

  fetch(
    criteria: FetchRPMBillingSummaryRequest
  ): Observable<PagedResponse<RPMStateSummaryItem>> {
    return from(this.database.fetchRPMBillingReport(criteria))
  }

  fetchSuperbill(): Promise<any> {
    return this.database.fetchRPMSuperbillReport(this.criteria)
  }

  mapResult(
    result: PagedResponse<RPMStateSummaryItem>
  ): Array<RPMStateSummaryEntry> {
    // pagination handling
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset + result.data.length

    this.totalCount = result.pagination.totalCount ?? 0

    if (!result || !result.data.length) {
      return []
    }

    const allBillings = Object.keys(RPM_CODE_COLUMNS).map(
      (key) =>
        ({
          code: key,
          eligibility: {}
        } as any)
    )

    return result.data.map(
      (element) =>
        new RPMStateSummaryEntry(element, allBillings, this.criteria.asOf)
    )
  }
}
