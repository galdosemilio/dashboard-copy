/**
 * GET /measurement/activity/summary
 */

import { PagedResponse } from '../../../content/entities';
import { MeasurementActivitySegment } from '../entities';

export type GetSummaryMeasurementActivityResponse = PagedResponse<MeasurementActivitySegment>;
