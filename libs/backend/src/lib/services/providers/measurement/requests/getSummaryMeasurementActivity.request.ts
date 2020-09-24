/**
 * GET /measurement/activity/summary
 */

import { MeasurementActivityUnit, PageOffset, PageSize } from '../../../shared';

export interface GetSummaryMeasurementActivityRequest {
  /** The client account id. Optional for Client requests, otherwise required. */
  account?: string;
  /** Start of the date range to get the activity for. */
  start: string;
  /** End of the date range to get the activity for. Defaults to today if not provided. */
  end?: string;
  /** Device ID to filter with. */
  device?: number;
  /** The unit of time that the results should be aggregated with. */
  unit: MeasurementActivityUnit;
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Number of items to offset from beginning of the result set. */
  offset?: PageOffset;
}
