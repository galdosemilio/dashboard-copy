/**
 * GET /supplement/:id/locale/:locale
 */

export interface GetLocaleSupplementResponse {
  /** Translated full name of the supplement. */
  fullName: string;
  /** Translated short name of the supplement. */
  shortName?: string;
}
