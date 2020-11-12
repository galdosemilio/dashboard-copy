/**
 * Interface for GET /key/organization
 */

export interface FetchAllOrganizationKeyRequest {
  account?: string // only optional if requester is a Client
  organization: string
  keyOrganizationId?: string
  name?: string
  isActive?: boolean
  directAssociation?: boolean
}
