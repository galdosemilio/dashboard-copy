/**
 * Interface for PATCH /conference/video/call
 */

export interface UpdateCallRequest {
  callId: string
  participants?: string[]
  callEnded?: boolean
}
