/**
 * mealEntity
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity } from '../generic/index.test';

export const mealEntity = createValidator({
  /** Meal ID. */
  id: t.string,
  /** Account associated with the meal. */
  account: optional(entity)
});
