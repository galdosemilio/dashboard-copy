import { CcrPaginatorComponent } from '@coachcare/common/components'
import { NotifierService } from '@app/service'
import { TableDataSource } from '@app/shared/model'
import {
  FetchRPMBillingSummaryRequest,
  PagedResponse,
  RPMStateSummaryItem
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { RPM_CODE_COLUMNS, RPMStateSummaryEntry } from '../rpm/models'
import { ReportsDatabase } from './reports.database'

export class RPMBillingDataSource extends TableDataSource<
  RPMStateSummaryEntry,
  PagedResponse<RPMStateSummaryItem>,
  FetchRPMBillingSummaryRequest
> {
  timeoutCheckCount: number = 5

  constructor(
    protected database: ReportsDatabase,
    protected notify: NotifierService,
    private paginator?: CcrPaginatorComponent
  ) {
    super()

    // listen the paginator events
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize,
        offset: this.paginator.pageIndex * (this.paginator.pageSize ?? 50)
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

  fetchSuperbill(criteria: FetchRPMBillingSummaryRequest): Promise<any> {
    return this.database.fetchRPMSuperbillReport(criteria)
  }

  updateItem(data: RPMStateSummaryEntry) {
    const index = this._result.findIndex((entry) => entry.id === data.id)

    if (index > -1) {
      this._result[index] = data
    }
  }

  mapResult(
    result: PagedResponse<RPMStateSummaryItem>
  ): Array<RPMStateSummaryEntry> {
    // pagination handling
    this.getTotal(result)

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
