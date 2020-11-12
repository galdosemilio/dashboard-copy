/**
 * GET /food/serving/:id/locale/:locale
 */

export interface GetFoodServingLocaleRequest {
  /** ID of the serving. */
  id: string
  /** Name of the locale. */
  locale: string
}
