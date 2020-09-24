/**
 * GET /food/key/:id/locale/:locale
 */

export interface GetFoodKeyLocaleRequest {
  /** ID of the key. */
  id: string;
  /** Name of the locale. */
  locale: string;
}
