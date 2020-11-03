/**
 * Interface for GET /schedule/summary
 */

export interface FetchScheduleSummaryRequest {
  account: string
  start: string
  end: string
}
