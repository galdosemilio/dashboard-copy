/**
 * Interface for GET /message/activity-summary
 */

export interface GetMessageActivitySummaryRequest {
  /** Range filter for creation timestamp */
  createdAt?: {
    start: string
    end: string
  }
  /** Page size limit */
  limit?: number | 'all'
  /** Page offset */
  offset?: number
  /** Organization ID to use for the summary */
  organization: string
  /** Timezone to use for time conversions. Defaults to calling user's selected timezone, or 'UTC' if it's missing. */
  timezone?: string
}
