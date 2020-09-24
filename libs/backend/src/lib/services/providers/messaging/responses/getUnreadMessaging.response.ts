/**
 * GET /message/unread
 */

export interface GetUnreadMessagingResponse {
  /** The number of threads with unread messages. */
  unreadThreadsCount: number;
  /** The total number of unread messages. */
  unreadMessagesCount: number;
  /** The ids of threads with unread messages. */
  unreadThreadIds: Array<string>;
}
