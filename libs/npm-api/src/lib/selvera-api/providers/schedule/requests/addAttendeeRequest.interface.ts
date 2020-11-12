/**
 * Interface for POST /meeting/attendee
 */

import { MeetingAttendee } from '../entities/attendee.interface'

type AddMeetingAttendeeElement = Pick<
  MeetingAttendee,
  'account' | 'firstName' | 'lastName' | 'email'
>

export interface AddAttendeeRequest {
  meetingId: string
  attendees: Array<Partial<AddMeetingAttendeeElement>>
  recurring?: boolean
}
