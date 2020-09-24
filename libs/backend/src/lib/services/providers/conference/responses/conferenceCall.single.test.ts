/**
 * GET /conference/video/call/:id
 */

import { createTestFromValidator, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { conferenceParticipant, conferenceParticipantAttended } from '../../../shared/index.test';
import { ConferenceCallSingle } from './conferenceCall.single';

export const conferenceCallSingle = createValidator({
  /** Call entry ID. */
  callId: t.string,
  /** Call initiator account ID. */
  initiatorId: t.string,
  /** Twilio subaccount Id. */
  subaccountId: t.string,
  /** Organization Id. */
  organizationId: t.string,
  /** Contains lists of requested and attended call participants. */
  participants: createValidator({
    /** Array of the requested participant data. */
    requested: t.array(conferenceParticipant),
    /** Array of the attended participant data. */
    attended: t.array(conferenceParticipantAttended)
  }),
  /** Call room name. */
  room: t.string,
  /** Indicates whether call ended or in progress. */
  callEnded: t.boolean
});

export const conferenceCallResponse = createTestFromValidator<ConferenceCallSingle>(
  'ConferenceCallSingle',
  conferenceCallSingle
);
