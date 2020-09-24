/**
 * GET /supplement/:id/locale/:locale
 */

export interface GetLocaleSupplementRequest {
  /** ID of the supplement. */
  id: string;
  /** Name of the locale. */
  locale: string;
}
