export interface AddThreadPermissionRequest {
  /** Array of account IDs to add */
  accounts: string[]
  /** The id of the thread */
  threadId: string
}
