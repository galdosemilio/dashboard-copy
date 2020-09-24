/**
 * DELETE /food/ingredient/local/:id/locale/:locale
 */

export interface DeleteFoodIngredientLocaleRequest {
  /** ID of the ingredient. */
  id: string;
  /** Name of the locale. */
  locale: string;
}
