/**
 * Interface for DELETE /sequence/transition/:id
 */

export interface DeleteSeqTransitionRequest {
  /** Transition ID */
  id: string
  /** Organization ID */
  organization: string
}
