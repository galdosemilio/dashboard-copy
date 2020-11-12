/**
 * Interface for GET /key (response)
 */

import { KeyDataEntry } from '../entities'
import { PaginationResponse } from './paginationResponse.interface'

export interface FetchAllKeyResponse {
  data: Array<KeyDataEntry>
  pagination: PaginationResponse
}
