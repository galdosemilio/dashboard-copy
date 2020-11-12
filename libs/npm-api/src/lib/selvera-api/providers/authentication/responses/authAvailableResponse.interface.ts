/**
 * Interface for GET /authentication/:account
 */

import { AuthenticationSegment } from '../entities'

export interface AuthAvailableResponse {
  data: Array<AuthenticationSegment>
}
