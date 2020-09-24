/**
 * GET /conference/video/call
 */

import { ConferenceParticipant, ConferenceParticipantAttended } from '../../../shared';

export interface GetAllConferenceCallResponse {
  /** Collection of calls. */
  data: Array<{
    /** Call entry ID. */
    callId: string;
    /** Call initiator account ID. */
    initiatorId: string;
    /** Twilio subaccount Id. */
    subaccountId: string;
    /** Organization Id. */
    organizationId: string;
    /** Contains lists of requested and attended call participants. */
    participants: {
      /** Array of the requested participant data. */
      requested: Array<ConferenceParticipant>;
      /** Array of the attended participant data. */
      attended: Array<ConferenceParticipantAttended>;
    };
    /** Call room name. */
    room: string;
    /** Indicates whether call ended or in progress. */
    callEnded: boolean;
  }>;
}
