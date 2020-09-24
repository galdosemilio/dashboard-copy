/**
 * POST /food/consumed/new
 */

import { createTest } from '@coachcare/backend/tests';
import { entity } from '../../../shared/index.test';
import { AddFoodConsumedResponse } from './addFoodConsumed.response';

export const addFoodConsumedResponse = createTest<AddFoodConsumedResponse>(
  'AddFoodConsumedResponse',
  {
    /** The newly created consumed meal record. */
    consumed: entity,
    /** The newly created meal record. */
    meal: entity
  }
);
