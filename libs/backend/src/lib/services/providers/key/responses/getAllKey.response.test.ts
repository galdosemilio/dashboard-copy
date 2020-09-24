/**
 * GET /key
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { keySegment, pagination } from '../../../shared/index.test';
import { GetAllKeyResponse } from './getAllKey.response';

export const getAllKeyResponse = createTest<GetAllKeyResponse>('GetAllKeyResponse', {
  /** Key collection. */
  data: t.array(keySegment),
  /** Pagination object. */
  pagination: pagination
});
