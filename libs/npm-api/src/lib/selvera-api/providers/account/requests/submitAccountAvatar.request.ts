/**
 * PUT /account/:id/avatar
 */

export interface SubmitAccountAvatarRequest {
  /** ID of the account. */
  id: string
  /** Avatar image encoded in base64 string. */
  avatar: string
}
