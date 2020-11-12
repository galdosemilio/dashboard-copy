/**
 * Interface for GET /mfa
 */

export interface GetUserMFARequest {
  /** Account ID. Defaults to current user if it's not provided. */
  account?: string
  /** @deprecated Organization ID. No longer necessary and will be ignored. */
  organization?: string
}
