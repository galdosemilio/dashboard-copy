/**
 * GET /message/thread
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { messagingThread, pagination } from '../../../shared/index.test';
import { GetAllMessagingResponse } from './getAllMessaging.response';

export const getAllMessagingResponse = createTest<GetAllMessagingResponse>(
  'GetAllMessagingResponse',
  {
    /** Array of thread objects. */
    data: t.array(messagingThread),
    /** Pagination object. */
    pagination: pagination
  }
);
