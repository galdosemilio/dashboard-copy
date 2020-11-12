/**
 * Interface for POST /conference/video/call
 */

export interface NotifyCallEventRequest {
  callId: number
  event: 'aborted' | 'declined'
}
