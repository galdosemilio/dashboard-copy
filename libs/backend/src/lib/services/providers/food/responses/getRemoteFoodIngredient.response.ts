/**
 * GET /food/ingredient/:id
 */

import { Entity, IngredientType } from '../../../shared';
import { FoodServingSingle } from '../../food/responses/foodServing.single';

export interface GetRemoteFoodIngredientResponse {
  /** ID of the ingredient. If the ingredient is not local, this is the remote ID. */
  id: string;
  /** Name of the ingredient. */
  name: string;
  /** Type of the ingredient. */
  type?: IngredientType;
  /**
   * A flag indicating if it's a locally sourced ingredient. If the flag is `false`, the ID is a remote ID.
   * Otherwise, the ID is the local ingredient ID.
   */
  isLocal: boolean;
  /** Account information. Only included for local ingredients that are private. */
  account?: Entity;
  /** Serving collection. */
  servings: Array<FoodServingSingle>;
}
