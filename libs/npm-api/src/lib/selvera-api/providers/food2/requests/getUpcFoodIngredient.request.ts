/**
 * GET /food/ingredient/upc/:id
 */

import { FoodRegion } from '../entities';

export interface GetUPCFoodIngredientRequest {
    /** A UPC identifier of the ingredient. */
    id: string;
    /** Region to search the products in. A list of all supported regions is also available via GET /food/region. */
    region?: FoodRegion;
}
