/**
 * GET /message/permission
 */

export interface GetSingleMessagingPermissionRequest {
  /** The account of the user. */
  account: string
  /** The id of the thread. */
  threadId: string
}
