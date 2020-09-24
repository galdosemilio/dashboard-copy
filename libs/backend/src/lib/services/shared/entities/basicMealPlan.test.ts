/**
 * basicMealPlan
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const basicMealPlan = createValidator({
  /** The meal plan ID. */
  id: t.string,
  /** The meal plan description. */
  description: t.string
});
