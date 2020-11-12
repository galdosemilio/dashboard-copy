/**
 * POST /client/register
 */

export interface ClientRegisterResponse {
  /** The id of this user. */
  id: string
  /** The authentication token for this user, returned for device types other than Web. */
  token?: string
}
