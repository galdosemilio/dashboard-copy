/**
 * Timeslot
 */

import { MeetingAttendee } from './attendee.interface'

export interface MeetingTimeslot {
  slotStartTime: Timeslot
  accounts: MeetingAttendee[]
}

export interface Timeslot {
  utc: string
  local: string
  timezone: string
}

export interface MeetingDirection {
  after?: string
  before?: string
}
