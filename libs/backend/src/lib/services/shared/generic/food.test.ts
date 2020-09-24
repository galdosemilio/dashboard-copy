/**
 * Food
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { FoodTrackingMode } from './food';

export const foodTrackingMode = createValidator<FoodTrackingMode>({
  id: t.string,
  description: t.string,
  isActive: t.boolean
});
