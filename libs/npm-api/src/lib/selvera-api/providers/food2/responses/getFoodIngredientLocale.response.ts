/**
 * GET /food/ingredient/local/:id/locale/:locale
 */

export interface GetFoodIngredientLocaleResponse {
    /** Translated name of the ingredient. */
    name?: string;
}
