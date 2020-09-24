/**
 * GET /food/meal/:id/locale/:locale
 */

export interface GetFoodMealLocaleRequest {
  /** ID of the meal item. */
  id: string;
  /** Name of the locale. */
  locale: string;
}
