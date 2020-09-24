/**
 * GET /measurement/activity/summary
 */

import { MeasurementActivitySegment, PagedResponse } from '../../../shared';

export type GetSummaryMeasurementActivityResponse = PagedResponse<MeasurementActivitySegment>;
