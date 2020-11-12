/**
 * Interface for POST /login
 */

import { AccountTypeIds } from '../../account/entities'
import { DeviceTypeIds } from '../entities'

export interface SessionRequest {
  email: string
  password: string
  deviceType: DeviceTypeIds
  allowedAccountTypes: Array<AccountTypeIds>
  organization?: string
}
