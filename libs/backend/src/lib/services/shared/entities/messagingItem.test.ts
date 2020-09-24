/**
 * messagingItem
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { messagingAccount } from './messagingAccount.test';

export const messagingItem = createValidator({
  /** The id of the thread. */
  threadId: t.string,
  /** The subject of the thread. */
  subject: t.string,
  /** The id of the message. */
  messageId: t.string,
  /** The time of the message (in UTC) */
  createdAt: t.string,
  /** The content of the message. */
  content: t.string,
  /** The array of accounts associated with this record. */
  account: messagingAccount
});
