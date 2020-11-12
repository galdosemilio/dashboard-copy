/**
 * Interface for GET /hydration (Response)
 */

import { PaginationResponse } from './paginationResponse.interface'

export interface HydrationResponse {
  hydration: any
  pagination: PaginationResponse
}
