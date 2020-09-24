/**
 * GET /warehouse/organization/sign-ups/list
 */

import { PageOffset, PageSize, SignUpsReportSort } from '../../../shared';

export interface GetSignUpsListReportsRequest {
  /** The ID of the organization. */
  organization: string;
  /** The name of client. */
  name?: string;
  /** Report with data that start at or after this time, in ISO8601 format. */
  startDate?: string;
  /** Report with data that end at or before this time, in ISO8601 format. Defaults to now/today. */
  endDate?: string;
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Page offset. */
  offset?: PageOffset;
  /** A collection of sorting options. The ordering is applied in the order of parameters passed. Defaults to sorting by name. */
  sort?: Array<SignUpsReportSort>;
}
