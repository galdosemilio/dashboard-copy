/**
 * RecordRequest
 */

export interface RecordRequest {
  /** Fetch measurements recorded at this datetime or later */
  start: string
  /** Fetch measurements recorded at this datetime or earlier */
  end?: string
}
