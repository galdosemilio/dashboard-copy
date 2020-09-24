/**
 * GET /key/consumed/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { consumedMeal, entity, namedEntity, orgEntity } from '../../../shared/index.test';
import { KeyConsumedSingle } from './keyConsumed.single';

export const keyConsumedSingle = createValidator({
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
  consumedMeal: optional(consumedMeal)
});

export const keyConsumedResponse = createTestFromValidator<KeyConsumedSingle>(
  'KeyConsumedSingle',
  keyConsumedSingle
);
