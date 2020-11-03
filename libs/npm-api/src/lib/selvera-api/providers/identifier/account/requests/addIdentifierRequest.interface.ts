/**
 * Interface for POST /account/:account/external-identifier (Request)
 */

export interface AddIdentifierRequest {
  account: string;
  organization: string;
  name: string;
  value: string;
}
