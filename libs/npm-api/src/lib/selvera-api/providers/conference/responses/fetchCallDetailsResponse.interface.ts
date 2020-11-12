/**
 * Interface for GET /conference/video/call/:id (response)
 */

export interface FetchCallDetailsResponse {
  callId: string
  initiatorId: string
  subaccountId: string
  organizationId: string
  room: string
  participants: {
    requested: Array<{
      id: string
      firstName?: string
    }>
    attended: Array<{
      id: string
      firstName?: string
      callIdentity: string
    }>
  }
  callEnded: boolean
}
