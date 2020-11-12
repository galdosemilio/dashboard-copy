/**
 * Interface for GET /rpm/state
 */

import { RPMStatus } from '../entities'

export interface GetListRequest {
  account: string
  asOf?: string
  limit?: number | 'all'
  offset: number
  organization: string
  strict?: boolean
  status?: RPMStatus
}
