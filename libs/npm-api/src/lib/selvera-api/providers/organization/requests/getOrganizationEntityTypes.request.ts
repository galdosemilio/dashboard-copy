/**
 * Interface for GET /:organization/entity-type
 */

export interface GetOrganizationEntityTypesRequest {
  limit?: number | 'all'
  offset?: number
}
