/**
 * Interface for GET /food/meal (Response)
 */

import { EntityWithDescription } from '../entities';
import { PaginationResponse } from './paginationResponse.interface';

export interface FetchAllMealPlansResponse {
    data: Array<EntityWithDescription>;
    pagination: PaginationResponse;
}
