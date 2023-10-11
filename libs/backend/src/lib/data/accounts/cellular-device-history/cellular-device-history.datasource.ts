import { Injectable } from '@angular/core'
import { TableDataSource } from '@coachcare/backend/model'
import {
  CellularDeviceHistory,
  GetCellularDeviceHistoryRequest,
  GetCellularDeviceHistoryResponse
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { CellularDeviceHistoryDatabase } from './cellular-device-history.database'

@Injectable()
export class CellularDeviceHistoryDataSource extends TableDataSource<
  CellularDeviceHistory,
  GetCellularDeviceHistoryResponse,
  GetCellularDeviceHistoryRequest
> {
  constructor(protected database: CellularDeviceHistoryDatabase) {
    super()
  }

  isLoading = false

  defaultFetch(): GetCellularDeviceHistoryResponse {
    return {
      data: [],
      pagination: {}
    }
  }

  fetch(
    criteria: GetCellularDeviceHistoryRequest
  ): Observable<GetCellularDeviceHistoryResponse> {
    return from(this.database.getList(criteria))
  }

  mapResult(result: GetCellularDeviceHistoryResponse) {
    // pagination handling
    this.getTotal(result)

    return result.data
  }
}
