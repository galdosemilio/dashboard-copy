/**
 * Interface for POST /note/general
 */

export interface AddNoteRequest {
  content: string
  providerOnly?: boolean
  date?: string
  relatedAccounts?: Array<string>
}
