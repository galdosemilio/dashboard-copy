/**
 * Interface for POST /supplement/organization
 */

export interface AddSupplementAssociationRequest {
  supplement: string
  organization: string
  dosage?: number
}
