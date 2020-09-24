/**
 * messagingThread
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { lastMessage } from './lastMessage.test';
import { messagingAccount } from './messagingAccount.test';

export const messagingThread = createValidator({
  /** The id of the thread. */
  threadId: t.string,
  /** The subject of the thread. */
  subject: t.string,
  /** The array of accounts associated with this record. */
  account: t.array(messagingAccount),
  /** Last message sent. */
  lastMessage: lastMessage,
  /** Boolean value whether or not the user has read the thread (last message) */
  viewed: t.boolean
});
