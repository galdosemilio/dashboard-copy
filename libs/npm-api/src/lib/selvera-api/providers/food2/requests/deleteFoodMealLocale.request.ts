/**
 * DELETE /food/meal/:id/locale/:locale
 */

export interface DeleteFoodMealLocaleRequest {
  /** ID of the meal item. */
  id: string
  /** Name of the locale. */
  locale: string
}
