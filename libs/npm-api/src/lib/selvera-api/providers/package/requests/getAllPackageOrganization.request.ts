/**
 * GET /package/organization
 */

export interface GetAllPackageOrganizationRequest {
  /** Organization ID. */
  organization: string
  /** Fetch only selected package associations. */
  package?: string
  /** @deprecated use 'status' instead */
  isActive?: boolean
  /** Amount of objects per page to retrieve */
  limit?: number | 'all'
  /** Page offset indicator */
  offset?: number
  /** The status of the associations to fetch. Defaults to 'active'. */
  status?: 'active' | 'inactive' | 'all'
}
