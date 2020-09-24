/**
 * GET /supplement
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination, supplementItemLoc } from '../../../shared/index.test';
import { GetAllSupplementResponse } from './getAllSupplement.response';

export const getAllSupplementResponse = createTest<GetAllSupplementResponse>(
  'GetAllSupplementResponse',
  {
    /** Collection of supplement objects. */
    data: t.array(supplementItemLoc),
    /** Pagination object. */
    pagination: pagination
  }
);
