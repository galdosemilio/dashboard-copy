/**
 * POST /authentication/levl
 */

export interface AuthLevlExternalAuthRequest {
  /** Email address of Levl account. */
  email: string;
  /** Password of the Levl account. This password is not stored but passed through to Levl. Only resulting auth token is stored. */
  password: string;
}
