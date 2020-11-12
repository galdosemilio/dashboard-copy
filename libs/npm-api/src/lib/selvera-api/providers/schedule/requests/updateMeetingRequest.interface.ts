/**
 * Interface for PUT /meeting/:meetingId
 */

import { MeetingLocationRequest } from '../entities'
import { MeetingRecurringRequest } from '../entities/recurring.interface'

export interface UpdateMeetingRequest {
  meetingId: string
  title?: string
  startTime?: string
  endTime?: string
  meetingTypeId?: string
  note?: string
  recurring?: MeetingRecurringRequest
  location?: Partial<MeetingLocationRequest>
}
