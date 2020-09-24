/**
 * PATCH /key/organization/:id
 */

export interface UpdateKeyOrganizationRequest {
  /** ID of the key-organization association. */
  id: string;
  /** The default target quantity. */
  targetquantity?: number;
  /** If this key-organization is active. */
  isActive?: boolean;
}
