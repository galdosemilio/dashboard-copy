/**
 * DELETE /package/:id/locale/:locale
 */

export interface DeleteLocalePackageRequest {
  /** ID of the package. */
  id: string;
  /** Name of the locale. */
  locale: string;
}
