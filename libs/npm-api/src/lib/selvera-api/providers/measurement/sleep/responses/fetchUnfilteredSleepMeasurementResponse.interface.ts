/**
 * Interface for unfiltered GET /measurement/sleep (response)
 */

export interface FetchUnfilteredSleepMeasurementResponse {
  id: number
  user_id: number
  recorded_at: string
  sleep_date: string
  timezone?: string
  sleep_start?: string
  sleep_end?: string
  total?: number
  time_to_sleep?: number
  wake_up_count?: number
  deep_sleep?: number
  wake_up?: number
  light_sleep?: number
  rem_sleep?: number
  source?: number
}
