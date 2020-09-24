/**
 * DELETE /association/:account/:organization
 */

export interface DeleteOrganizationAssociationRequest {
  /** The ID of the client or provider account to remove association, passed as the first URI parameter. */
  account: string;
  /** The ID of the organization to remove association, passed as the last URI parameter. */
  organization: string;
}
