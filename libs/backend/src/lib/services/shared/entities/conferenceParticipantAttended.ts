/**
 * ConferenceParticipantAttended
 */

import { ConferenceParticipant } from './conferenceParticipant';

export interface ConferenceParticipantAttended extends ConferenceParticipant {
  /** Identity of the participant that is sent to Twilio. */
  callIdentity: string;
}
