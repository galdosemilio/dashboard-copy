/**
 * Interface for GET /key/consumed (response)
 */

import { ConsumedKeyResponse } from './consumedKeyResponse.interface'
import { PaginationResponse } from './paginationResponse.interface'

export interface FetchAllConsumedKeyResponse {
  data: Array<ConsumedKeyResponse>
  pagination: PaginationResponse
}
