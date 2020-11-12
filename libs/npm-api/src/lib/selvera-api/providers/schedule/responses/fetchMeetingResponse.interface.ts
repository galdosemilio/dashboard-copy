/**
 * Interface for GET /meeting/:meetingId (response)
 */

import {
  MeetingAttendeeResponse,
  MeetingLocationResponse,
  MeetingType
} from '../entities'
import { MeetingRecurringResponse } from '../entities/recurring.interface'

export interface FetchMeetingResponse {
  id: string
  /** @deprecated use 'creator' instead */
  createdBy?: string
  creator: {
    email: string
    firstName: string
    id: string
    lastName: string
  }
  title: string
  note?: string
  start: { utc: string }
  end: { utc: string }
  /** @deprecated use 'start.utc' instead */
  startTime: string
  /** @deprecated use 'end.utc' instead */
  endTime: string
  organization: {
    shortcode: string
    name: string
    hierarchyPath: string[]
    assets: {
      logoUrl?: string
      color?: string
    }
  }
  /** @deprecated use 'organization.shortcode instead' */
  organizationShortcode: string
  /** @deprecated use 'organization.name' instead */
  organizationName: string
  /** @deprecated use 'organization.assets.logoUrl' instead */
  organizationLogoUrl: string
  organizationHierarchy: Array<string>
  type: MeetingType
  timezone?: string
  googleCalendarId?: string
  recurring?: MeetingRecurringResponse
  attendees: Array<MeetingAttendeeResponse>
  location?: MeetingLocationResponse
}
