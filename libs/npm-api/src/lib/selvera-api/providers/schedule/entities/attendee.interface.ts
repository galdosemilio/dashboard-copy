/**
 * Attendee
 */

export interface MeetingAttendee {
  /** @deprecated use 'id' instead */
  account: string
  /** Account type entity */
  accountType: {
    /** Account type ID */
    id: string
  }
  /** Account email */
  email?: string
  /** Account first name */
  firstName: string
  /** Account ID */
  id: string
  /** Account last name */
  lastName: string
  /** Preferred locales collection */
  preferredLocales?: string[]
  /** Account timezone */
  timezone?: string
}

export type MeetingAttendeeRequest = {
  account: string | number
}

export type MeetingAttendeeResponse = MeetingAttendee & {
  /** Attendance data */
  attendance: {
    /** Attendance entry ID */
    id: string
    /** Attendance status entry */
    status?: {
      /** Attendance status ID */
      id: string
      /** Attendance status name translated to the closest matching, available language */
      name: string
    }
  }
  /** @deprecated use 'attendance' instead */
  attended?: boolean
}
