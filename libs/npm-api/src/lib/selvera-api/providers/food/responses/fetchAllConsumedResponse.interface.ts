/**
 * Interface for GET /food/consumed (Response)
 */

import { FetchAllSingleConsumedMealResponse } from './fetchAllConsumedMealResponse.interface';
import { PaginationResponse } from './paginationResponse.interface';

export interface FetchAllConsumedResponse {
    meals: Array<FetchAllSingleConsumedMealResponse>;
    pagination: PaginationResponse;
}
