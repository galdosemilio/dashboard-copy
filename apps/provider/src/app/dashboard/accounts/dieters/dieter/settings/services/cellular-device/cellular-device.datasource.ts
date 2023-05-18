import { Injectable } from '@angular/core'
import { ContextService } from '@app/service'
import { TableDataSource } from '@app/shared'
import { from, Observable } from 'rxjs'
import { CellularDeviceDatabase } from './cellular-device.database'
import {
  AccountCellularDevice,
  GetAllCellularDeviceResponse
} from '@coachcare/sdk'

@Injectable()
export class CellularDeviceDataSource extends TableDataSource<
  any,
  GetAllCellularDeviceResponse,
  string
> {
  constructor(
    protected context: ContextService,
    protected database: CellularDeviceDatabase
  ) {
    super()
  }

  defaultFetch(): GetAllCellularDeviceResponse {
    return { data: [], pagination: {} }
  }

  fetch(): Observable<GetAllCellularDeviceResponse> {
    const account = this.context.account.id
    return from(this.database.getAll(account))
  }

  mapResult(result: GetAllCellularDeviceResponse): AccountCellularDevice[] {
    return result.data
  }
}
