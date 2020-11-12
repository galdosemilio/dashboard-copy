/**
 * Interface for GET /note/consultation/:id (response)
 */

export interface FetchConsultationNoteResponse {
  id: string
  content: string
  subjective?: string
  objective?: string
  assessment?: string
  plan?: string
  createdBy: string // AccountId
  providerOnly: boolean
  date: string // timestamp
  createdAt: string // timestamp
  updatedAt?: string // timestamp
  relatedAccounts: Array<string>
}
