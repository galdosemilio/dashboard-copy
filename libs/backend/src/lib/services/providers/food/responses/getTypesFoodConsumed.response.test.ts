/**
 * GET /food/consumed/type
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { describedEntity } from '../../../shared/index.test';
import { GetTypesFoodConsumedResponse } from './getTypesFoodConsumed.response';

export const getTypesFoodConsumedResponse = createTest<GetTypesFoodConsumedResponse>(
  'GetTypesFoodConsumedResponse',
  {
    /** The type of consumed meal. */
    data: t.array(describedEntity)
  }
);
