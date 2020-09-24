/**
 * GET /food/serving/:id/locale/:locale
 */

export interface GetFoodServingLocaleResponse {
  /** A description of a serving. */
  description?: string;
  /** A measurement description. */
  measurementDescription?: string;
  /** Unit of a serving, at least one of description. */
  unit?: string;
}
