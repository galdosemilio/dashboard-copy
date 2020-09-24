/**
 * PATCH /key/account/:id
 */

export interface UpdateKeyAccountRequest {
  /** ID of the key-organization-account association. */
  id: string;
  /** The default target quantity. */
  targetquantity?: number;
}
