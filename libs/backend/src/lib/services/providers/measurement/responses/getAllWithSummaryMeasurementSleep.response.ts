/**
 * GET /measurement/sleep/summary
 */

import { MeasurementSleepSummary } from '../../../shared';

export interface GetAllWithSummaryMeasurementSleepResponse {
  /** Array of measurement objects. */
  data: Array<{
    /** The start date for the returning result set in 'YYYY-MM-DD' format. */
    date: string;
    /** The total number of minutes slept on the date. */
    sleepMinutes: number;
    /** The average number of minutes slept over all sleep periods on the date. */
    averageMinutes: number;
    /** The average sleep quality over all sleep periods on the date. */
    sleepQuality: string;
  }>;
  /** Summary Object. */
  summary: MeasurementSleepSummary;
}
