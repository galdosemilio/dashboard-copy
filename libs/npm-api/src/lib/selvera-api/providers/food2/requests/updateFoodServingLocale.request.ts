/**
 * PUT /food/serving/:id/locale/:locale
 */

export interface UpdateFoodServingLocaleRequest {
  /** ID of the serving. */
  id: string
  /** Name of the locale. */
  locale: string
  /** Localized description of a serving. */
  description?: string
  /** Localized measurement description. */
  measurementDescription?: string
  /** Localized unit of a serving. */
  unit?: string
}
