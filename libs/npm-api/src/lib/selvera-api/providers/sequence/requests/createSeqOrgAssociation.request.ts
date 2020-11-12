/**
 * Interface for POST /sequence/organization
 */

export interface CreateSeqOrgAssociationRequest {
  /** The ID of the user creating the Association */
  createdBy: string
  /** A flag indicating if the Association is active or not */
  isActive?: boolean
  /** Organization ID */
  organization: string
  /** Sequence ID */
  sequence: string
}
