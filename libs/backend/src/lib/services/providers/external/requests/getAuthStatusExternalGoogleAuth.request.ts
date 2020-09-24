/**
 * GET /schedule/google/:id/authStatus
 */

export interface GetAuthStatusExternalGoogleAuthRequest {
  /** The account ID to get authentication URL for. */
  id: string;
  /** The OAuth code. */
  code: string;
}
