/**
 * GET /food/ingredient/:id
 */

import { FoodRegion } from '../entities';

export interface GetRemoteFoodIngredientRequest {
    /** A remote identifier of the ingredient. */
    id: string;
    /** Region to search the products in. A list of all supported regions is also available via GET /food/region. */
    region?: FoodRegion;
}
