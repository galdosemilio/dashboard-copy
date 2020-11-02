/**
 * Interface for POST /meeting
 */

import { MeetingAttendeeRequest, MeetingLocationRequest } from '../entities';
import { MeetingRecurringRequest } from '../entities/recurring.interface';

export interface AddMeetingRequest {
    title: string;
    startTime: string; // .toISOString() timestamp
    endTime: string; // .toISOString() timestamp
    meetingTypeId: string;
    timezone?: string;
    organizationId?: string;
    organizationShortcode?: string;
    note?: string;
    recurring?: MeetingRecurringRequest;
    attendees?: Array<MeetingAttendeeRequest>;
    location?: MeetingLocationRequest;
}
