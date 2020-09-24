/**
 * POST /consent
 */

export interface CreateConsentRequest {
  /** Account of the user for which the consent is intended. Will default to current user if missing. */
  account?: string;
  /** Action given. */
  action: string;
  /** ToS version ID the consent is created for. */
  tosVersionId: string;
  /** Organization name. Can be null for personal account consents. */
  organization?: string;
}
