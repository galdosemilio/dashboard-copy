/**
 * Segment of the accounts authentications
 */

import { AuthenticationService } from './service.interface'
import { AuthenticationToken } from './token.interface'

export interface AuthenticationSegment {
  service: AuthenticationService
  token?: AuthenticationToken
}
