/**
 * POST /assignment
 */

export interface CreateOrganizationAssignmentRequest {
  /** The ID of the client to assign. */
  client: string;
  /** The ID of the provider to assign. */
  provider: string;
  /** The ID of the organization to assign. */
  organization: string;
}
