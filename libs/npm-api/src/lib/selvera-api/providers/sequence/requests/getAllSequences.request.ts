/**
 * Interface for GET /sequence
 */

export interface GetAllSequencesRequest {
  /** Indicates whether to retrieve a full Sequence with States, Transitions and Triggers */
  full?: boolean
  /** Page size */
  limit?: number | 'all'
  /** Page offset */
  offset?: number
  /** Organzation ID */
  organization: string
  /** Sequence name filter */
  query?: string
  /** Sequence status filter */
  status?: 'active' | 'inactive' | 'all'
  /** If the sequence has autoenrollments */
  autoenrollment?: boolean
}
