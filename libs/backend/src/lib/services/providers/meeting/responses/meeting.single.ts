/**
 * GET /meeting/:id
 */

import { MeetingAttendeeDataExtended, MeetingLocation, MeetingRecurring } from '../../../shared';

export interface MeetingSingle {
  /** The id of this meeting. */
  id: string;
  /** The title of this meeting. */
  title: string;
  /** A note for this meeting. */
  note?: string;
  /** Creator of the meeting. */
  createdBy?: string;
  /** The start time of this meeting. */
  startTime: string;
  /** The start time of this meeting. */
  endTime: string;
  /** An organization shortcode the meeting is associated with. */
  organizationShortcode: string;
  /** Full organization name. */
  organizationName: string;
  /** Organization logo URL. */
  organizationLogoUrl: string;
  /** Organization hierarchy path. */
  organizationHierarchy: Array<string>;
  /** The type of this meeting. */
  type: {
    /** ID of the meeting type. */
    id: number;
    /** The code of the meeting type. */
    code?: string;
    /** The description of the meeting type. */
    description: string;
  };
  /** The google calendar ID of this meeting. */
  googleCalendarId?: string;
  /** Recurring meeting information, will be null if it's a non-recurring meeting. */
  recurring?: MeetingRecurring;
  /** An array of meeting attendee objects. */
  attendees: Array<MeetingAttendeeDataExtended>;
  /** The location object, will be null if it is a virtual meeting. */
  location?: MeetingLocation;
}
