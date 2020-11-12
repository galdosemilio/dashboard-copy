/**
 * Interface for GET /communication/interaction
 */
export interface GetAllInteractionsRequest {
  /** Account ID */
  account?: string
  /** Page size limit */
  limit?: number | 'all'
  /** Page offset */
  offset?: number
  /** Organization ID */
  organization?: string
  /** A timestamp range filter for the interaction */
  range?: {
    start: string
    end: string
  }
  /** Source ID */
  source?: string
  /** Interaction state filter */
  status?: 'in-progress' | 'ended'
}
