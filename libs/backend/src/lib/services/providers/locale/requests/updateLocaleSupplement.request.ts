/**
 * PUT /supplement/:id/locale/:locale
 */

export interface UpdateLocaleSupplementRequest {
  /** ID of the supplement. */
  id: string;
  /** Name of the locale. */
  locale: string;
  /** Translated full name of the supplement. */
  fullName: string;
  /** Translated short name of the supplement. */
  shortName?: string;
}
