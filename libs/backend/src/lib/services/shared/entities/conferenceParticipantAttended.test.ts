/**
 * conferenceParticipantAttended
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { conferenceParticipant } from './conferenceParticipant.test';

export const conferenceParticipantAttended = createValidator({
  ...conferenceParticipant.type.props,
  /** Identity of the participant that is sent to Twilio. */
  callIdentity: t.string
});
