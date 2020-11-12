/**
 * Interface for GET /warehouse/organization/activity
 */

import { OrganizationActivityAggregate } from './organizationActivityAggregate.interface'

export interface OrganizationActivityResponse {
  data: Array<OrganizationActivityAggregate>
}
