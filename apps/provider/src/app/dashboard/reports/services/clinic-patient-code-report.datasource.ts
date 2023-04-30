import { CcrPaginatorComponent } from '@coachcare/common/components'
import { NotifierService } from '@app/service'
import { TableDataSource } from '@app/shared/model'
import {
  FetchCareManagementBillingSnapshotRequest,
  FetchCareManagementBillingSnapshotResponse
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { ReportsDatabase } from './reports.database'
import { CareManagementStateSummaryItem } from '@coachcare/sdk/dist/lib/providers/reports/responses/fetchCareManagementBillingSnapshotResponse.interface'

export class ClinicPatientCodeDataSource extends TableDataSource<
  CareManagementStateSummaryItem,
  FetchCareManagementBillingSnapshotResponse,
  FetchCareManagementBillingSnapshotRequest
> {
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

  defaultFetch(): FetchCareManagementBillingSnapshotResponse {
    return { data: [], pagination: {} }
  }

  fetch(
    criteria: FetchCareManagementBillingSnapshotRequest
  ): Observable<FetchCareManagementBillingSnapshotResponse> {
    return from(this.database.fetchCareManagementBillingSnapshot(criteria))
  }

  async mapResult(
    result: FetchCareManagementBillingSnapshotResponse
  ): Promise<CareManagementStateSummaryItem[]> {
    // pagination handling
    this.getTotal(result)

    if (!result?.data?.length) {
      return []
    }

    return result.data
  }
}
