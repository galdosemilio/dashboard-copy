/**
 * Interface for unfiltered GET /measurement/sleep
 */

export interface FetchUnfilteredSleepMeasurementRequest {
  client_id?: number | null
  start_date?: string | null
  end_date?: string | null
}
