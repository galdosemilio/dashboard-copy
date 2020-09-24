/**
 * keyConsumedMeal
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { namedEntity } from '../generic/index.test';

export const keyConsumedMeal = createValidator({
  /** The id of the consumed meal entry. */
  id: t.string,
  /** The date when the meal was consumed. */
  consumedAt: t.string,
  /** The actual consumed meal. */
  meal: namedEntity
});
