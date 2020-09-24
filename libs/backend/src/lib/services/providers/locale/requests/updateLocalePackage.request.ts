/**
 * PUT /package/:id/locale/:locale
 */

export interface UpdateLocalePackageRequest {
  /** ID of the package. */
  id: string;
  /** Name of the locale. */
  locale: string;
  /** Translated title of the package. */
  title: string;
  /** Translated description of the package. */
  description?: string;
}
