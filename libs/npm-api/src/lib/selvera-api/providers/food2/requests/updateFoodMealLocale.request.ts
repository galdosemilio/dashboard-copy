/**
 * PUT /food/meal/:id/locale/:locale
 */

export interface UpdateFoodMealLocaleRequest {
  /** ID of the meal item. */
  id: string
  /** Name of the locale. */
  locale: string
  /** Desired name of a meal. */
  name?: string
}
