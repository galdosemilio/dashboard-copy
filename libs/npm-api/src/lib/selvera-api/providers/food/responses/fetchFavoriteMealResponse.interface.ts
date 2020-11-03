/**
 * Interface for GET /food/favorite (Response)
 */

import { Meal } from '../entities';
import { PaginationResponse } from './paginationResponse.interface';

export interface FetchFavoriteMealResponse {
    meals: Array<Meal>;
    pagination: PaginationResponse;
}
