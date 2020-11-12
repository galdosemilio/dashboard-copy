/**
 * Interface for GET /food/meal (Response)
 */

import { Meal } from '../entities'
import { PaginationResponse } from './paginationResponse.interface'

export interface FetchAllMealResponse {
  meals: Array<Meal>
  pagination: PaginationResponse
}
