/**
 * GET /warehouse/weight/change
 */

import { PageOffset, PageSize, WeigthChangeSort } from '../../../shared';

export interface GetWeightChangeReportsRequest {
  /** The ID of the organization. */
  organization: string;
  /** The start date in ISO8601 format. */
  startDate: string;
  /** The end date in ISO8601 format. */
  endDate: string;
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Page offset. */
  offset?: PageOffset;
  /** A collection of sorting options. The ordering is applied in the order of parameters passed. Defaults to sorting by name. */
  sort?: Array<WeigthChangeSort>;
}
