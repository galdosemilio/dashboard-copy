import { cred, org, state } from '@coachcare/backend/tests';
import * as moment from 'moment';

import {
  AddMeetingAttendeeRequest,
  CreateMeetingRequest,
  DeleteSingleMeetingAttendeeRequest,
  GetAllMeetingRequest,
  UpdateMeetingAttendeeRequest,
  UpdateMeetingRequest
} from '../../../providers';
import { Entity } from '../../../shared';

/**
 * Requests
 */

// Meeting

export const getAllMeetingRequest = (): GetAllMeetingRequest => ({
  // own meetings
  accounts: state.role ? [cred[state.role].id] : []
});

export const createMeetingRequest = (): CreateMeetingRequest => ({
  title: 'Test Lunch',
  startTime: moment()
    .hours(12)
    .minutes(0)
    .toISOString(),
  endTime: moment()
    .hours(12)
    .minutes(29)
    .toISOString(),
  meetingTypeId: 2,
  organizationShortcode: org.shortcode,
  attendees: [
    {
      account: cred.Client.id
    }
  ]
});

export const updateMeetingRequest = (): UpdateMeetingRequest => ({
  id: state[state.role].meetingId,
  meetingTypeId: 2
});

export const deleteMeetingRequest = (): Entity => ({
  id: state[state.role].meetingId
});

// Meeting Attendee

export const addMeetingAttendeeRequest = (): AddMeetingAttendeeRequest => ({
  meetingId: state[state.role].meetingId,
  attendees: [
    {
      account: cred.Provider.id,
      email: cred.Provider.email,
      firstName: 'Provider',
      lastName: 'Test'
    }
  ]
});

export const updateMeetingAttendeeRequest = (): UpdateMeetingAttendeeRequest => ({
  meetingId: state[state.role].meetingId,
  account: cred.Provider.id,
  attended: true
});

export const deleteMeetingAttendeeRequest = (): DeleteSingleMeetingAttendeeRequest => ({
  meetingId: state[state.role].meetingId,
  account: cred.Provider.id
});
