/**
 * DELETE /food/meal-plan/type/:id/locale/:locale
 */

export interface DeleteFoodMealPlanTypeLocaleRequest {
  /** ID of the meal-plan type. */
  id: string
  /** Name of the locale. */
  locale: string
}
