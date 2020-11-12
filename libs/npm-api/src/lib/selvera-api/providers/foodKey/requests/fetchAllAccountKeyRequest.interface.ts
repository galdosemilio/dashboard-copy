/**
 * Interface for GET /key/account
 */

export interface FetchAllAccountKeyRequest {
  account: string
  organization: string
  name?: string
}
