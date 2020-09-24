/**
 * PUT /meeting/:id
 */

import { MeetingLocation } from '../../../shared';

export interface UpdateMeetingRequest {
  /** The id of the meeting, passed as the last URI parameter. */
  id: string;
  /** The title for the meeting. */
  title?: string;
  /** Start Time for the meeting. */
  startTime?: string;
  /** End Time for the meeting. */
  endTime?: string;
  /** ID of the meeting type. */
  meetingTypeId?: number;
  /** A note about the meeting. */
  note?: string;
  /**
   * Recurring meeting information. If it's a singular meeting, and not a recurring series, this property can be skipped.
   * A single, existing meeting cannot be 'converted' into a series.
   * Updates will be applied to all future meetings in the series.
   */
  recurring?: {
    /** Interval for the recurring meeting. */
    interval: string;
    /** The end date for the recurring series. */
    endDate: string;
  };
  /** An object containing location information if meeting is physical. */
  location?: Partial<MeetingLocation>;
}
