/**
 * GET /conference/video/call/availability
 */

export interface GetAvailabilityConferenceCallRequest {
  /** ID of the account to look up the call for. */
  account: string;
}
