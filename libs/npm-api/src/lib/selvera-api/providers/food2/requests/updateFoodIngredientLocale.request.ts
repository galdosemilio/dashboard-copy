/**
 * PUT /food/ingredient/local/:id/locale/:locale
 */

export interface UpdateFoodIngredientLocaleRequest {
    /** ID of the ingredient. */
    id: string;
    /** Name of the locale. */
    locale: string;
    /** Translated name of the ingredient. */
    name?: string;
}
