import { MFAToken } from '../../common/entities'
import { DeviceTypeIds } from '../entities'

export interface MFASessionRequest {
  organization: string
  email: string
  password: string
  token: MFAToken
  deviceType: DeviceTypeIds
}
