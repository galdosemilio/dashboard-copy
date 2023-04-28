import { CcrPaginatorComponent } from '@coachcare/common/components'
import { NotifierService, CareManagementService } from '@app/service'
import { TableDataSource } from '@app/shared/model'
import {
  FetchCareManagementBillingMonthRequest,
  FetchCareManagementBillingSnapshotRequest,
  FetchCareManagementBillingSnapshotResponse
} from '@coachcare/sdk'
import { from, Observable, of } from 'rxjs'
import { RPMStateSummaryEntry } from '../rpm/models'
import { ReportsDatabase } from './reports.database'
import { CareManagementStateSummaryItem } from '@coachcare/sdk/dist/lib/providers/reports/responses/fetchCareManagementBillingSnapshotResponse.interface'

export class RPMBillingDataSource extends TableDataSource<
  CareManagementStateSummaryItem,
  FetchCareManagementBillingSnapshotResponse,
  FetchCareManagementBillingSnapshotRequest
> {
  timeoutCheckCount: number = 5

  constructor(
    protected database: ReportsDatabase,
    protected notify: NotifierService,
    protected careManagementService: CareManagementService,
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

  defaultFetch(): FetchCareManagementBillingSnapshotResponse {
    return { data: [], pagination: {} }
  }

  fetch(
    criteria: FetchCareManagementBillingSnapshotRequest
  ): Observable<FetchCareManagementBillingSnapshotResponse> {
    return criteria.organization
      ? from(this.database.fetchCareManagementBillingSnapshot(criteria))
      : of(this.defaultFetch())
  }

  fetchSuperbill(
    criteria: FetchCareManagementBillingMonthRequest
  ): Promise<any> {
    return this.database.fetchRPMSuperbillReport(criteria)
  }

  updateItem(data: CareManagementStateSummaryItem) {
    const index = this._result.findIndex(
      (entry) => entry.account.id === data.account.id
    )

    if (index > -1) {
      this._result[index] = data
    }
  }

  async mapResult(
    result: FetchCareManagementBillingSnapshotResponse
  ): Promise<CareManagementStateSummaryItem[]> {
    // pagination handling
    this.getTotal(result)

    if (!result?.data?.length) {
      return []
    }

    const allBillings = this.careManagementService.billingCodes
      .filter(
        (code) => code.serviceType.id === result.data[0].state.serviceType.id
      )
      .map((code) => ({
        code: code.value,
        eligibility: {}
      }))

    const trackableCodes =
      this.careManagementService.trackableCptCodes[
        result.data[0].state.serviceType.id
      ] || {}

    return result.data.map(
      (element) =>
        new RPMStateSummaryEntry(
          element,
          allBillings,
          trackableCodes,
          this.criteria.asOf
        )
    )
  }
}
