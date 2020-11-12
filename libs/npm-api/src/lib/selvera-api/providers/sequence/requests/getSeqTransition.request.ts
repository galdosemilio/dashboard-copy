/**
 * Interface for GET /sequence/transition/:id
 */

export interface GetSeqTransitionRequest {
  /** Transition ID */
  id: string
  /** Organization ID */
  organization: string
}
