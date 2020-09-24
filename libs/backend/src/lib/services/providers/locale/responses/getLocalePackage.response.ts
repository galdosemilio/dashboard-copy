/**
 * GET /package/:id/locale/:locale
 */

export interface GetLocalePackageResponse {
  /** Translated title of the package. */
  title: string;
  /** Translated description of the package. */
  description?: string;
}
