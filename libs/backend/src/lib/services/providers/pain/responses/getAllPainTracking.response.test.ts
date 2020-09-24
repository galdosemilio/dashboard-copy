/**
 * GET /pain-tracking/history
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination } from '../../../shared/index.test';
import { painTrackingSingle } from '../../pain/responses/painTracking.single.test';
import { GetAllPainTrackingResponse } from './getAllPainTracking.response';

export const getAllPainTrackingResponse = createTest<GetAllPainTrackingResponse>(
  'GetAllPainTrackingResponse',
  {
    /** Pagination object. */
    pagination: pagination,
    /** List of pain registries. */
    data: t.array(painTrackingSingle)
  }
);
