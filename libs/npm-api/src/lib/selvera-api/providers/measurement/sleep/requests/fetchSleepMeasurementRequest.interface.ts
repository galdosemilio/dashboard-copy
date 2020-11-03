/**
 * Interface for GET /measurement/sleep
 */

export interface FetchSleepMeasurementRequest {
  account?: number;
  startDate?: string;
  endDate?: string;
}
