/**
 * POST /meeting/attendee
 */

export interface AddMeetingAttendeeRequest {
  /** The id of the meeting. */
  meetingId: string;
  /** An attendee id array. */
  attendees: Array<{
    /** The id of the attendee. */
    account: string;
    /** First name of the attendee. */
    firstName: string;
    /** The id of the attendee. */
    lastName: string;
    /** The id of the attendee. */
    email: string;
  }>;
  /**
   * Indicates whether to add the attendee to the recurring series for the meeting, if applicable. Defaults to 'false', i.e.
   * adding an attendee to a single meeting.
   */
  recurring?: boolean;
}
