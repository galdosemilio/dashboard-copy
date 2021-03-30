/**
 * Interface for GET /rpm/supervising-provider
 */

export interface GetSupervisingProvidersRequest {
  organization: string
  limit?: number
  offset?: number
}
