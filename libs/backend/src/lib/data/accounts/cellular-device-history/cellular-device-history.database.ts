import { Injectable } from '@angular/core'
import { AppDatabase } from '@coachcare/backend/model'
import {
  AccountProvider,
  GetCellularDeviceHistoryRequest,
  GetCellularDeviceHistoryResponse
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'

@Injectable()
export class CellularDeviceHistoryDatabase extends AppDatabase {
  constructor(private account: AccountProvider) {
    super()
  }

  getList(
    args: GetCellularDeviceHistoryRequest
  ): Observable<GetCellularDeviceHistoryResponse> {
    return from(this.account.getCellularDeviceHistory(args))
  }
}
