/**
 * Interface for POST /account/password
 */

import { MFAToken } from '../../common/entities'

export interface AccUpdatePasswordMFARequest {
  password: {
    old: string
    new: string
  }
  organization: string
  token: MFAToken
}
