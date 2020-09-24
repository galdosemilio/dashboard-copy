/**
 * GET /food/meal/:meal/serving/:serving
 */

export interface GetSingleFoodMealServingRequest {
  /** The id of the meal that is being associated. */
  meal: string;
  /** The id of the serving to associate. */
  serving: string;
}
