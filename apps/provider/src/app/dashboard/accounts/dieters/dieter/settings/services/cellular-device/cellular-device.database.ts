import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared/model'
import {
  AccountProvider,
  GetAllCellularDeviceResponse,
  GetAllTypesResponse,
  AddCellularDeviceRequest,
  RemoveCellularDeviceRequest
} from '@coachcare/sdk'

@Injectable()
export class CellularDeviceDatabase extends CcrDatabase {
  constructor(private account: AccountProvider) {
    super()
  }

  getAll(account: string): Promise<GetAllCellularDeviceResponse> {
    return this.account.getAllCellularDevices(account)
  }

  getTypes(): Promise<GetAllTypesResponse> {
    return this.account.getAllCellularDeviceTypes()
  }

  add(request: AddCellularDeviceRequest): Promise<void> {
    return this.account.addCellularDevice(request)
  }

  remove(request: RemoveCellularDeviceRequest): Promise<void> {
    return this.account.removeCellularDevice(request)
  }
}
