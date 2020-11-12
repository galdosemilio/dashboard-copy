/**
 * Interface for DELETE /meeting/recurring
 */

export interface DeleteRecurringMeetingRequest {
  /** Indicates that only the meetings in the series that start after a specific timestamp should be deleted */
  after?: string
  /** The id of the meeting in a recurring series */
  id: string
}
