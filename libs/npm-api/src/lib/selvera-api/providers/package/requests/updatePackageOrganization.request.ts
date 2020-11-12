/**
 * PATCH /package/organization/:id
 */

export interface UpdatePackageOrganizationRequest {
  /** ID of the package-organization association. */
  id: string
  /** The default sortOrder of the package for the organization. */
  sortOrder?: number
  /** Indicates whether association is active or not. */
  isActive?: boolean
}
