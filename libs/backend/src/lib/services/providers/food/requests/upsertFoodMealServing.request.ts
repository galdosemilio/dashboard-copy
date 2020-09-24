/**
 * PUT /food/meal/:meal/serving/:serving
 */

export interface UpsertFoodMealServingRequest {
  /** The id of the meal that is being associated. */
  meal: string;
  /** The id of the serving to associate. */
  serving: string;
  /** Quantity of serving associated with the meal. */
  quantity?: number;
}
