/**
 * Interface for POST /key/account
 */

export interface AddAccountKeyRequest {
  keyOrganizationId: string
  account: string
  targetQuantity: number
}
