/**
 * Interface for GET /account/:account/external-identifier (Request)
 */

export interface FetchAllIdentifiersRequest {
  account: string;
  organization: string;
  strict?: boolean;
  status?: string;
}
