/**
 * GET /supplement/organization
 */

import { PageOffset, PageSize } from '../../../shared';

export interface GetAllSupplementOrganizationRequest {
  /** ID of an organization. */
  organization: string;
  /** Page entry limit. Takes a number or can be set to 'all' to fetch all entries. */
  limit?: PageSize;
  /** The page offset. */
  offset?: PageOffset;
}
