/**
 * GET /organization/
 */

import { ActiveStatus, OrgSort, PageOffset, PageSize } from '../../../shared';

export interface GetAllOrganizationRequest {
  /** Organization name filter. */
  name?: string;
  /** Organization status filter. */
  status?: ActiveStatus;
  /** Pagination limit. Can be set to 'all' to include all entries. */
  limit?: PageSize;
  /** Pagination offset. */
  offset?: PageOffset;
  /** A collection that determines how the result should be sorted. */
  sort?: Array<OrgSort>;
}
