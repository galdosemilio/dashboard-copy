/**
 * Interface for GET /sequence/state/:id
 */

export interface GetSequenceStateRequest {
  /** Sequence State ID */
  id: string
  /** Organization ID */
  organization: string
}
