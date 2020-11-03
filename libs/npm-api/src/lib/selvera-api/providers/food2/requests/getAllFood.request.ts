/**
 * GET /food
 */

import { PageOffset } from '../../content/entities';
import { FoodRegion } from '../entities';

export interface GetAllFoodRequest {
    /** The search query for the ingredient being searched for. */
    query: string;
    /** Number of records to offset. */
    offset?: PageOffset;
    /** Number of records per page. Cannot exceed 50. 'all' is not supported, since it exceeds 50. */
    limit?: number;
    /** Region to search the products in. A list of all supported regions is also available via GET /food/region. */
    region?: FoodRegion;
}
