/**
 * Interface for GET /account/:account/external-identifier/:id (Request)
 */

export interface FetchIdentifierRequest {
  account: string;
  id: string;
}
