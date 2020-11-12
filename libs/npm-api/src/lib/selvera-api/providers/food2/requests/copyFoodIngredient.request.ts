/**
 * PUT /food/ingredient/copy/:id
 */

import { FoodRegion } from '../entities'

export interface CopyFoodIngredientRequest {
  /** ID of a remote ingredient. */
  id: string
  /** Region to search the products in. A list of all supported regions is also available via GET /food/region. */
  region?: FoodRegion
}
