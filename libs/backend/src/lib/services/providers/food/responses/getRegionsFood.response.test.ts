/**
 * GET /food/region
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetRegionsFoodResponse } from './getRegionsFood.response';

export const getRegionsFoodResponse = createTest<GetRegionsFoodResponse>('GetRegionsFoodResponse', {
  /** Region name collection. */
  data: t.array(t.string)
});
