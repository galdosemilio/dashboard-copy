/**
 * POST /message/permission
 */

export interface CreateMessagingPermissionRequest {
  /** Array of account IDs to add. */
  accounts: Array<string>
  /** The id of the thread. */
  threadId: string
}
