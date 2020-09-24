/**
 * MessagingItem
 */

import { MessagingAccount } from './messagingAccount';

export interface MessagingItem {
  /** The id of the thread. */
  threadId: string;
  /** The subject of the thread. */
  subject: string;
  /** The id of the message. */
  messageId: string;
  /** The time of the message (in UTC) */
  createdAt: string;
  /** The content of the message. */
  content: string;
  /** The array of accounts associated with this record. */
  account: MessagingAccount;
}
