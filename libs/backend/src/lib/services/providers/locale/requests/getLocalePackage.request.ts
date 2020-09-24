/**
 * GET /package/:id/locale/:locale
 */

export interface GetLocalePackageRequest {
  /** ID of the package. */
  id: string;
  /** Name of the locale. */
  locale: string;
}
