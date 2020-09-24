/**
 * GET /conference/video/call/availability
 */

export interface GetAvailabilityConferenceCallResponse {
  /**
   * A flag indicating whether the selected account is available on a call.
   * If set to `false`, it means the account is on another call.
   */
  isAvailable: boolean;
}
