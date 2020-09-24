/**
 * GET /key/consumed
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { consumedKeyItem, pagination } from '../../../shared/index.test';
import { GetAllKeyConsumedResponse } from './getAllKeyConsumed.response';

export const getAllKeyConsumedResponse = createTest<GetAllKeyConsumedResponse>(
  'GetAllKeyConsumedResponse',
  {
    /** Array of consumed keys records. */
    data: t.array(consumedKeyItem),
    /** Pagination object. */
    pagination: pagination
  }
);
