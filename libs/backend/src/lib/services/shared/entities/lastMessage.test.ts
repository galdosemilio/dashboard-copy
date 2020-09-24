/**
 * lastMessage
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const lastMessage = createValidator({
  /** The id of the last message sent. */
  id: t.string,
  /** The timestamp of the last message sent. */
  date: t.string,
  /** The content of the last message sent. */
  content: t.string,
  /** The account id of the last message author. */
  accountId: t.string
});
