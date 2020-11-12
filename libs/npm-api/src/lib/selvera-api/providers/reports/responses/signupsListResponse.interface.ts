/**
 * Interface for GET /warehouse/sign-ups/list
 */

import { SignupsListSegment } from './signupsListSegment.interface'

export interface SignupsListResponse {
  data: Array<SignupsListSegment>
}
