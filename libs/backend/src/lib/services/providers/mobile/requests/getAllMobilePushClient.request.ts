/**
 * GET /notification/mobile-push/client
 */

export interface GetAllMobilePushClientRequest {
  /** Retrieve client for this token. */
  token?: string;
  /** Retrieve clients for this account. Can only be passed when called as an administrator, defaults to current user otherwise. */
  account?: string;
}
