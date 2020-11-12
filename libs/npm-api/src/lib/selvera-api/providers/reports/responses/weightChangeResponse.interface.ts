/**
 * Interface for GET /warehouse/weight/change (response)
 */

import { PaginationResponse } from '../../common/entities'
import { WeightChangeSegment } from '../entities'

export interface WeightChangeResponse {
  data: Array<WeightChangeSegment>
  pagination: PaginationResponse
}
