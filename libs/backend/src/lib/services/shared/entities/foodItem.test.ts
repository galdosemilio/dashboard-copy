/**
 * foodItem
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { foodType } from './foodType.test';

export const foodItem = createValidator({
  /** Remote food item (ingredient) ID. */
  id: t.string,
  /** Food item name. */
  name: t.string,
  /** Food item description. */
  description: t.string,
  /** Brand name. */
  brand: optional(t.string),
  /** URL of the food item. */
  url: optional(t.string),
  /** Type of the food item. */
  type: foodType
});
