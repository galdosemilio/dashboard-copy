/**
 * Model for login object
 */

import { AccountTypeIds } from '../../account/entities/index'
import { DeviceTypeIds } from '../../session/entities/index'
import { SessionRequest } from '../../session/requests/index'
import { LoginRequest } from './login.interface'

class LoginModel implements SessionRequest {
  public readonly email: string
  public readonly password: string
  public readonly organization: string
  public readonly deviceType: DeviceTypeIds
  public readonly allowedAccountTypes: Array<AccountTypeIds>

  public constructor(request: LoginRequest) {
    this.email = request.email
    this.password = request.password
    this.deviceType = request.deviceType.toString() as DeviceTypeIds
    this.allowedAccountTypes = request.permittedAccountTypes.map(
      (v) => v.toString() as AccountTypeIds
    )

    if (request.organization) {
      this.organization = request.organization
    }
  }
}

export { LoginModel }
