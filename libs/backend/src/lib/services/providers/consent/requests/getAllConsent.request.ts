/**
 * GET /consent
 */

export interface GetAllConsentRequest {
  /** ID of the consent. */
  id?: string;
  /** ID of the ToS version. */
  tosVersionId?: number;
  /** ID of the ToS group. */
  metaId?: string;
  /** Consent action. */
  action?: string;
  /** Account for which the consent was intended for. */
  account?: string;
  /** Organization filter. */
  organization?: string;
  /** ToS title. */
  title?: string;
}
