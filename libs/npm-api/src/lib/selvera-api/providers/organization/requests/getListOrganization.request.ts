/**
 * GET /access/organization
 */

import { ActiveStatus, OrgAccessSort } from '../../common/entities'
import { PageOffset, PageSize } from '../../content/entities'
import { AllOrgPermissions } from '../entities'

export interface GetListOrganizationRequest {
  /** The ID of the account to look up the organization access for. Defaults to current user if not provided. */
  user?: string
  /** Filter query for organization name. */
  query?: string
  /** The status of organization. */
  status?: ActiveStatus
  /** Organization hierarchy filter. */
  hierarchyFilter?: Array<string>
  /**
   * A flag indicating whether only direct organization associations should be retrieved.
   * (`true`), or if we should retrieve a cascaded associations.
   */
  strict?: boolean
  /** The permissions object. */
  permissions?: Partial<AllOrgPermissions>
  /** Page entry limit. Takes a number or can be set to 'all' to fetch all entries. */
  limit?: PageSize
  /** The page offset. */
  offset?: PageOffset
  /**
   * A collection of sorting options. The ordering is applied in the order of parameters passed.
   * Defaults to sorting by name ascending.
   */
  sort?: Array<OrgAccessSort>
}
