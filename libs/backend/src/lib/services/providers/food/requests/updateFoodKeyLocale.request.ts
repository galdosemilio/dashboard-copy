/**
 * PUT /food/key/:id/locale/:locale
 */

export interface UpdateFoodKeyLocaleRequest {
  /** ID of the key. */
  id: string;
  /** Name of the locale. */
  locale: string;
  /** Desired name of a key. */
  name?: string;
  /** Desired description of a key. */
  description?: string;
}
