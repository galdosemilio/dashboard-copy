/**
 * GET /food/consumed/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity, foodConsumedSummary, foodMealItem, namedEntity } from '../../../shared/index.test';
import { FoodConsumedSingle } from './foodConsumed.single';

export const foodConsumedSingle = createValidator({
  /** The id of the consumed record. */
  id: t.string,
  /** The account that created this consumed record. */
  account: entity,
  /** The timestamp this meal was consumed. */
  consumedAt: t.string,
  /** The timestamp of when the consumed record was created. */
  createdAt: t.string,
  /** The type of the consumed meal. */
  type: namedEntity,
  /** The number of servings of this meal that were consumed. */
  serving: t.number,
  /** The note of the consumed meal. */
  note: optional(t.string),
  /** Shows if user has favorited this meal. */
  isFavorite: t.boolean,
  /** The meal that was consumed. */
  meal: foodMealItem,
  /** The summary of nutrients of consumed meal. */
  summary: foodConsumedSummary
});

export const foodConsumedResponse = createTestFromValidator<FoodConsumedSingle>(
  'FoodConsumedSingle',
  foodConsumedSingle
);
