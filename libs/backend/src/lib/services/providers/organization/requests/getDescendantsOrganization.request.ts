/**
 * GET /organization/:id/descendants
 */

import { PageOffset, PageSize } from '../../../shared';

export interface GetDescendantsOrganizationRequest {
  /** The id of the organization. */
  id: string;
  /** Organization name filter. */
  query?: string;
  /** Page entry limit. Takes a number or can be set to 'all' to fetch all entries. */
  limit?: PageSize;
  /** The page offset. */
  offset?: PageOffset;
}
