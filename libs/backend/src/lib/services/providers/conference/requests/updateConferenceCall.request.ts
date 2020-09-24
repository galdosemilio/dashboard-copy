/**
 * PATCH /conference/video/call/:id
 */

export interface UpdateConferenceCallRequest {
  /** Id of started call. Passed as last URI param. */
  id: string;
  /** Array of accounts ids, requested to be a call participants. */
  participants?: Array<string>;
  /**
   * Takes only 'true' value to indicate that call ended. Any other values will be ignored.
   * Once call ended, it's metadata editing will unavailable.
   */
  callEnded?: boolean;
}
