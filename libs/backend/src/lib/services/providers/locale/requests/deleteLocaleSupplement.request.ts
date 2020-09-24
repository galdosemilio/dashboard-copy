/**
 * DELETE /supplement/:id/locale/:locale
 */

export interface DeleteLocaleSupplementRequest {
  /** ID of the supplement association. */
  id: string;
  /** Name of the locale. */
  locale: string;
}
