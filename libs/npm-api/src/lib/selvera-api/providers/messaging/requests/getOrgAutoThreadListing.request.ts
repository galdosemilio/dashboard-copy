/**
 * Interface for GET /message/preference/organization/{id}/auto-participation
 */

export interface GetOrgAutoThreadListingRequest {
  /** Preference ID */
  id: string
  limit?: number | 'all'
  offset?: number
}
