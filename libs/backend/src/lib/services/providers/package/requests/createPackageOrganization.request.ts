/**
 * POST /package/organization
 */

export interface CreatePackageOrganizationRequest {
  /** ID of the package. */
  package: string;
  /** Organization ID. */
  organization: string;
  /** The default sortOrder of the package for the organization. */
  sortOrder?: number;
}
