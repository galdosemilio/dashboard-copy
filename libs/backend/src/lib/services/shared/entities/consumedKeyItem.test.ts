/**
 * consumedKeyItem
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity, namedEntity } from '../generic/index.test';
import { keyConsumedMeal } from './keyConsumedMeal.test';
import { orgEntity } from './orgEntity.test';

export const consumedKeyItem = createValidator({
  /** The id of the consumed key record. */
  consumedId: t.string,
  /** The account that created this consumed key record. */
  account: entity,
  /** The key that was consumed. */
  key: namedEntity,
  /** The organization that key is assigned to. */
  organization: orgEntity,
  /** Date and time the key was consumed, in ISO8601 format. */
  consumedAt: t.string,
  /** The timestamp of when the record was created. */
  createdAt: t.string,
  /** The number of units of this key that was consumed. */
  quantity: t.number,
  /** The consumed meal entry that the key-consumption entry is coming from. */
  consumedMeal: optional(keyConsumedMeal)
});
