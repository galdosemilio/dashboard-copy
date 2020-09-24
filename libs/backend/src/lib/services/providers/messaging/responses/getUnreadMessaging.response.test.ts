/**
 * GET /message/unread
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetUnreadMessagingResponse } from './getUnreadMessaging.response';

export const getUnreadMessagingResponse = createTest<GetUnreadMessagingResponse>(
  'GetUnreadMessagingResponse',
  {
    /** The number of threads with unread messages. */
    unreadThreadsCount: t.number,
    /** The total number of unread messages. */
    unreadMessagesCount: t.number,
    /** The ids of threads with unread messages. */
    unreadThreadIds: t.array(t.string)
  }
);
