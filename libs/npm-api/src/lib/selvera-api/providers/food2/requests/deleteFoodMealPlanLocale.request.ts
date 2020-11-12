/**
 * DELETE /food/meal-plan/:id/locale/:locale
 */

export interface DeleteFoodMealPlanLocaleRequest {
  /** ID of the meal-plan. */
  id: string
  /** Name of the locale. */
  locale: string
}
