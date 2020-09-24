/**
 * GET /food/ingredient/local/:id/locale/:locale
 */

export interface GetFoodIngredientLocaleRequest {
  /** ID of the ingredient. */
  id: string;
  /** Name of the locale. */
  locale: string;
}
