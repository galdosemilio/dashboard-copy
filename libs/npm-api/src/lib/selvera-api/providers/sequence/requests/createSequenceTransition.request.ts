/**
 * Interface for POST /sequence/transition
 */

export interface CreateSeqTransitionRequest {
  /** ID of the user creating the Transition */
  createdBy: string
  /**
   * Delay of the Transition. Should be a valid, positive, Postgres interval.
   * Can be skipped if there should be no delay on the Transition.
   */
  delay?: string
  /** ID of the source State */
  from?: string
  /** Organization ID */
  organization: string
  /** ID of the target State */
  to: string
}
