/**
 * DELETE /meeting/:meetingId/attendee/:account/recurring
 */

export interface DeleteRecurringMeetingAttendeeRequest {
  /** The id of the meeting. */
  meetingId: string;
  /** The id of the account to remove from the meeting. */
  account: string;
}
