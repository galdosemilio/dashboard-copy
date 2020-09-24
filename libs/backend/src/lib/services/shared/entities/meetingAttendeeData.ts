/**
 * MeetingAttendeeData
 */

export interface MeetingAttendeeData {
  /** The id of the account. */
  account: string;
  /** The first name of the individual. */
  firstName: string;
  /** The last name of the individual. */
  lastName: string;
  /** The email of the individual. */
  email: string;
  /** A flag indicating whether the participant attended the meeting. */
  attended?: boolean;
}
