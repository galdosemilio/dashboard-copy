/**
 * GET /message/thread/:threadId
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { messagingItem, pagination } from '../../../shared/index.test';
import { GetThreadMessagingResponse } from './getThreadMessaging.response';

export const getThreadMessagingResponse = createTest<GetThreadMessagingResponse>(
  'GetThreadMessagingResponse',
  {
    /** Thread related messages. */
    data: t.array(messagingItem),
    /** Pagination object. */
    pagination: pagination
  }
);
