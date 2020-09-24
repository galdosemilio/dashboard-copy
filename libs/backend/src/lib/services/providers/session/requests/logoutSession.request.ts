/**
 * POST /logout
 */

export interface LogoutSessionRequest {
  /** Session token, defaults to logged in user and can be overwritten only by administrators. */
  token?: string;
}
