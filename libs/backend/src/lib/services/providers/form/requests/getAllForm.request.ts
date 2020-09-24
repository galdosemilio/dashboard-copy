/**
 * GET /content/form
 */

import { ActiveStatus, PageOffset, PageSize } from '../../../shared';

export interface GetAllFormRequest {
  /** Organization to retrieve the content items for. */
  organization: string;
  /**
   * A flag indicating if we should only check for the most specific organization, or the whole hierarchy.
   * Defaults to `false` - whole hierarchy is checked.
   */
  strict?: boolean;
  /** A form name filter. */
  query?: string;
  /** A status of the form items to include. */
  status?: ActiveStatus;
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Number of items to offset from beginning of the result set. */
  offset?: PageOffset;
}
