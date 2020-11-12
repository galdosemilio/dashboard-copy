/**
 * Interface for GET /sequence/:id
 */

export interface GetSequenceRequest {
  /** Sequence ID */
  id: string
  /** Indicated whether to retrieve a 'full' Sequence object with States, Transitions and Triggers */
  full?: boolean
  /** Organization ID */
  organization: string
  /** Status filter */
  status: 'active' | 'inactive' | 'all'
}
