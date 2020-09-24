/**
 * GET /message/permission
 */

export interface GetSingleMessagingPermissionRequest {
  /** The account of the user. Optional for Client requests, otherwise required. */
  account?: string;
  /** The id of the thread. */
  threadId: string;
}
