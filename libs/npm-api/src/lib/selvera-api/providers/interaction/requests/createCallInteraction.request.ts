/**
 * Interface for POST /communication/interaction/call
 */
export interface CreateCallInteractionRequest {
  /** Billable service for Twilio call. Defaults to 'RPM'. */
  billableService?: string
  organization: string
  participants: string[]
  room: string
}
