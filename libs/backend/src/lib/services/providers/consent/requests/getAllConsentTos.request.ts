/**
 * GET /consent/tos
 */

export interface GetAllConsentTosRequest {
  /** ID of the ToS version. */
  id?: string;
  /** ID of the ToS group. */
  metaId?: number;
  /** Organization filter. */
  organization?: string;
  /** ToS title filter. */
  title?: string;
  /** ToS anonymous access filter. */
  allowAnonymousAccess?: boolean;
}
