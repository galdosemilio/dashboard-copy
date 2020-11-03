/**
 * DELETE /food/serving/:id/locale/:locale
 */

export interface DeleteFoodServingLocaleRequest {
    /** ID of the serving. */
    id: string;
    /** Name of the locale. */
    locale: string;
}
