/**
 * foodMealItem
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const foodMealItem = createValidator({
  /** The id of the meal that was consumed. */
  id: t.string,
  /** The name of the meal record. */
  name: t.string,
  /** The image url of the meal. */
  imageUrl: optional(t.string)
});
