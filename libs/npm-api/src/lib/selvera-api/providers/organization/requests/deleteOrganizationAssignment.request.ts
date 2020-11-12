/**
 * DELETE /assignment/:client/:provider/:organization
 */

export interface DeleteOrganizationAssignmentRequest {
  /** The ID of the client to remove assignment. */
  client: string
  /** The ID of the provider to remove assignment. */
  provider: string
  /** The ID of the organization to remove assignment. */
  organization: string
}
