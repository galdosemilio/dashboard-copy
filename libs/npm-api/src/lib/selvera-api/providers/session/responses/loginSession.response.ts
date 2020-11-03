/**
 * POST /login
 */

import { AccountTypeId } from '../../account/entities'
import { Entity } from '../../common/entities'

export interface LoginSessionResponse {
  /** Account type of the logged user. */
  accountType: AccountTypeId
  /** Session token. If deviceType is Web the cookie is set and the token is not returned. */
  token?: string
  mfa?: { channel: Entity }
  _links?: { self: string; mfa: string }
}
