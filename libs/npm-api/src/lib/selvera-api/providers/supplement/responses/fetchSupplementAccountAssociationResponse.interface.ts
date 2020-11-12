/**
 * Interface for GET /supplement/account/organization/ (Response)
 */

export interface FetchSupplementAccountAssociationResponse {
  id: string
  supplementOrganizationId: string
  accountId: string
  dosage?: number
}
