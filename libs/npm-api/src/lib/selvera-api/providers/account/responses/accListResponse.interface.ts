/**
 * Interface for GET /access/account (response)
 */

import { AccountAccessData } from '../entities'
import { PaginationResponse } from './paginationResponse.interface'

export interface AccListResponse {
  data: Array<AccountAccessData>
  pagination: PaginationResponse
}
