/**
 * DELETE /meeting/:meetingId/attendee/:account
 */

export interface DeleteSingleMeetingAttendeeRequest {
  /** The id of the meeting. */
  meetingId: string;
  /** The id of the account to remove from the meeting. */
  account: string;
}
