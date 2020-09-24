/**
 * GET /food/meal
 */

import { PageOffset, PageSize } from '../../../shared';

export interface GetAllFoodMealRequest {
  /** Organization to retrieve the meals for. */
  organization: string;
  /** Account associated with the meal. If account is passed, only return results associated with this account. */
  account?: string;
  /** Filter by the name of the meal. */
  query?: string;
  /** ID of the meal plan to filter by. */
  mealPlan?: string;
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Number of meals to offset from beginning of query. */
  offset?: PageOffset;
}
