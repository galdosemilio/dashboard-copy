/**
 * Interface for POST /login (response)
 */

import { AccountTypeIds } from '../../account/entities'
import { Entity } from '../../common/entities'

export interface SessionResponse {
  accountType: AccountTypeIds
  mfa?: { channel: Entity }
  _links?: { self: string; mfa: string }
  token?: string
}
