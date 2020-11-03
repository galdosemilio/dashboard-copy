/**
 * GET /food/key/:id/locale/:locale
 */

export interface GetFoodKeyLocaleResponse {
    /** Localized name of a key. */
    name?: string;
    /** Localized description of a key. */
    description?: string;
}
