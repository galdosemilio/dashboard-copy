/**
 * POST /key/organization
 */

export interface CreateKeyOrganizationRequest {
  /** ID of the key. */
  key: string;
  /** Organization ID. */
  organization: string;
  /** The target quantity. */
  targetQuantity?: number;
}
