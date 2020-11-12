/**
 * Interface for POST /sequence/:id/clone
 */

export interface CreateSequenceCloneRequest {
  /** The ID of the user cloning the sequence */
  createdBy: string
  /** The ID of the Sequence to clone */
  id: string
  /** Organization ID to attach to cloned Sequence to */
  organization: string
}
