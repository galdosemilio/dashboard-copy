/**
 * POST /meeting
 */

import { MeetingLocation } from '../../../shared';

export interface CreateMeetingRequest {
  /** The title for the meeting. */
  title: string;
  /** Start Time for the meeting. */
  startTime: string;
  /** End Time for the meeting. */
  endTime: string;
  /** ID of the meeting type. */
  meetingTypeId: number;
  /**
   * The shortcode of the organization this meeting is associated with.  If left blank, defaults to 'selvera'.
   * Used for getting organization data and email reminders.
   */
  organizationShortcode?: string;
  /**
   * The id of the organization this meeting is associated with. Used for getting organization data and for email reminders.
   * If given, overrides organizationShortcode.
   */
  organizationId?: string;
  /** Notes about meeting. */
  note?: string;
  /** Recurring meeting information. If it's a singular meeting, and not a recurring series, this property can be skipped. */
  recurring?: {
    /** Interval for the recurring meeting. */
    interval: string;
    /** The end date for the recurring series. */
    endDate: string;
  };
  /** An array of attendees to add to meeting. */
  attendees?: Array<{
    /** The account id of the attendee. */
    account: string;
  }>;
  /** An object containing location information if meeting is physical. */
  location?: MeetingLocation;
}
