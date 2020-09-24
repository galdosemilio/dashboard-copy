/**
 * POST /conference/video/call/event
 */

export interface EmitEventConferenceCallRequest {
  /** ID of the call. */
  callId: string;
  /** Call event. */
  event: string;
}
