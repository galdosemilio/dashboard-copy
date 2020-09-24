/**
 * POST /key/account
 */

export interface CreateKeyAccountRequest {
  /** ID of the key-organization entry. */
  keyOrganizationId: string;
  /** Account ID. */
  account: string;
  /** The target quantity. */
  targetQuantity?: number;
}
