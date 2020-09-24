/**
 * GET /conference/video/call
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { conferenceParticipant, conferenceParticipantAttended } from '../../../shared/index.test';
import { GetAllConferenceCallResponse } from './getAllConferenceCall.response';

export const getAllConferenceCallResponse = createTest<GetAllConferenceCallResponse>(
  'GetAllConferenceCallResponse',
  {
    /** Collection of calls. */
    data: t.array(
      createValidator({
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
      })
    )
  }
);
