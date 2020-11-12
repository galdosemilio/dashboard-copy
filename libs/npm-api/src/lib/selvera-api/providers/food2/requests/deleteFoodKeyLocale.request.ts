/**
 * DELETE /food/key/:id/locale/:locale
 */

export interface DeleteFoodKeyLocaleRequest {
  /** ID of the key. */
  id: string
  /** Name of the locale. */
  locale: string
}
