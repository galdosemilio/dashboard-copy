/**
 * PUT /attendance
 */

export interface UpdateMeetingAttendeeRequest {
  /** The meeting ID. */
  meetingId: string;
  /** An account to set the attendance for. Optional for Client requests, otherwise required. */
  account?: string;
  /** A flag indicating if the user attended the meeting (true) or missed it (false) */
  attended: boolean;
}
