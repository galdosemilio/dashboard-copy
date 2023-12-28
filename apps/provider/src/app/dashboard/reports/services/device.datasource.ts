import { CcrPaginatorComponent } from '@coachcare/common/components'
import { TableDataSource } from '@app/shared/model'
import {
  FetchCellularDeviceAssociationRequest,
  CellularDeviceAssociation,
  FetchCellularDeviceAssociationResponse
} from '@coachcare/sdk'
import { from, Observable, of } from 'rxjs'
import { ReportsDatabase } from './reports.database'

export class DeviceDataSource extends TableDataSource<
  CellularDeviceAssociation,
  FetchCellularDeviceAssociationResponse,
  FetchCellularDeviceAssociationRequest
> {
  constructor(
    protected database: ReportsDatabase,
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

  defaultFetch(): FetchCellularDeviceAssociationResponse {
    return { data: [], pagination: {} }
  }

  fetch(
    criteria: FetchCellularDeviceAssociationRequest
  ): Observable<FetchCellularDeviceAssociationResponse> {
    return criteria.organization
      ? from(this.database.fetchCellularDeviceAssociation(criteria))
      : of(this.defaultFetch())
  }

  async mapResult(
    result: FetchCellularDeviceAssociationResponse
  ): Promise<CellularDeviceAssociation[]> {
    // pagination handling
    this.getTotal(result)

    if (!result?.data?.length) {
      return []
    }

    return result.data
  }
}
