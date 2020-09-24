/**
 * GET /package/organization
 */

export interface GetAllPackageOrganizationRequest {
  /** Organization ID. */
  organization: string;
  /** Fetch only selected package associations. */
  package?: string;
  /** Fetch only active / inactive associations. */
  isActive?: boolean;
}
