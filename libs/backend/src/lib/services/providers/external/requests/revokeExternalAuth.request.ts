/**
 * DELETE /authentication/:account/:service
 */

export interface RevokeExternalAuthRequest {
  /** Account ID. */
  account: string;
  /** A service to which the authentication should be revoked. */
  service: string;
}
