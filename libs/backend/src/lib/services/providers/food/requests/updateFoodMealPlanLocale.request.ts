/**
 * PUT /food/meal-plan/:id/locale/:locale
 */

export interface UpdateFoodMealPlanLocaleRequest {
  /** ID of the meal-plan. */
  id: string;
  /** Name of the locale. */
  locale: string;
  /** Translated description of a meal-plan. */
  description?: string;
}
