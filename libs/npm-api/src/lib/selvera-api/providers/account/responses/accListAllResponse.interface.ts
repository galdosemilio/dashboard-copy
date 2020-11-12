/**
 * Interface for GET /account (response)
 */

import { AccountFullData } from '../entities'
import { PaginationResponse } from './paginationResponse.interface'

export interface AccListAllResponse {
  data: Array<AccountFullData>
  pagination: PaginationResponse
}
