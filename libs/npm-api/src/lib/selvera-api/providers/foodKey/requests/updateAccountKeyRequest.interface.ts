/**
 * Interface for POST /key/account
 */

export interface UpdateAccountKeyRequest {
  id: string
  isActive?: boolean
  name?: string
  description?: string
}
