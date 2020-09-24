/**
 * POST /conference/video/call
 */

export interface CreateConferenceCallRequest {
  /** Room identifier/name. */
  room: string;
  /** Array of accounts ids, requested to be a call participants. */
  participants: Array<string>;
  /** Id of twilio subaccount for organization. */
  subaccountId: string;
}
