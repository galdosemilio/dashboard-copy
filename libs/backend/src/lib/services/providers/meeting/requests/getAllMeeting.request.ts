/**
 * GET /meeting
 */

import { MeetingTypeCode, PageOffset, PageSize } from '../../../shared';

export interface GetAllMeetingRequest {
  /** An array of account ids of meeting attendees. */
  accounts?: Array<string>;
  /** An array of email addresses of meeting attendees. */
  emails?: Array<string>;
  /** Select meetings that start at or after this time, in ISO8601 format. */
  startTimeBegin?: string;
  /** Select meetings that start at or before this time, in ISO8601 format. */
  startTimeEnd?: string;
  /** Select meetings that are of this type.  Type 'selvera' includes 1on1initial, 1on1, and circle only. */
  type?: MeetingTypeCode;
  /**
   * Select meetings only associated with organization hierarchy related to this organization.
   * Accepts only organization shortcode, not organization id.
   */
  organizationShortcode?: string;
  /** Pagination page size. */
  limit?: PageSize;
  /** Pagination offset. */
  offset?: PageOffset;
}
