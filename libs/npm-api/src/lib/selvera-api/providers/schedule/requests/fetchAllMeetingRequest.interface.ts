/**
 * Interface for GET /meeting
 */

import { MeetingDirection, MeetingSort } from '../entities'

export interface FetchAllMeetingRequest {
  /** Meeting attendee account ID filter */
  account?: string
  /** @deprecated use 'account' instead */
  accounts?: Array<string>
  /** @deprecated this property is no longer supported */
  emails?: Array<string>
  /** @deprecated this property is no longer supported */
  end?: MeetingDirection
  /** Pagination page size */
  limit?: 'all' | number
  /** Pagination offset */
  offset?: number
  organization: string
  /** @deprecated use 'organization' instead */
  organizationShortcode?: string
  /** Meeting overlap range */
  range?: {
    /** Range start */
    start: string
    /** Range end */
    end: string
  }
  /** A collection that determines how the result should be sorted */
  sort?: Array<MeetingSort>
  /** @deprecated use 'range.start' instead */
  startTimeBegin?: string // Timestamp: ISO String
  /** @deprecated use 'range.end' instead */
  startTimeEnd?: string // Timestamp: ISO String
  /** Meeting type ID filter */
  type?: string
}
