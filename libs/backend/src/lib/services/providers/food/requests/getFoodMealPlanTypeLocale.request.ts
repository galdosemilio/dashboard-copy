/**
 * GET /food/meal-plan/type/:id/locale/:locale
 */

export interface GetFoodMealPlanTypeLocaleRequest {
  /** ID of the meal-plan type. */
  id: string;
  /** Name of the locale. */
  locale: string;
}
