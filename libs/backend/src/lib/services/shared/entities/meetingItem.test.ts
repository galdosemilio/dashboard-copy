/**
 * meetingItem
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { meetingAttendeeData } from './meetingAttendeeData.test';
import { meetingLocation } from './meetingLocation.test';
import { meetingRecurring } from './meetingRecurring.test';

export const meetingItem = createValidator({
  /** The id of this meeting. */
  id: t.string,
  /** Creator of the meeting. */
  createdBy: optional(t.string),
  /** The title of this meeting. */
  title: t.string,
  /** A note for this meeting. */
  note: optional(t.string),
  /** The start time of this meeting. */
  startTime: t.string,
  /** The start time of this meeting. */
  endTime: t.string,
  /** An organization shortcode the meeting is associated with. */
  organizationShortcode: t.string,
  /** Full organization name. */
  organizationName: t.string,
  /** Organization logo URL. */
  organizationLogoUrl: t.string,
  /** Organization hierarchy path. */
  organizationHierarchy: t.array(t.string),
  /** The type of this meeting. */
  type: createValidator({
    /** ID of the meeting type. */
    id: t.number,
    /** The code of the meeting type. */
    code: optional(t.string),
    /** The description of the meeting type. */
    description: t.string
  }),
  /** Recurring meeting information, will be null if it's a non-recurring meeting. */
  recurring: optional(meetingRecurring),
  /** An array of meeting attendee objects. */
  attendees: t.array(meetingAttendeeData),
  /** The location object, will be null if it is a virtual meeting. */
  location: optional(meetingLocation)
});
