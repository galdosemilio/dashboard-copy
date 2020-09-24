/**
 * foodConsumedFrequently
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity } from '../generic/index.test';
import { foodFrequentSummary } from './foodFrequentSummary.test';
import { foodMealConsumption } from './foodMealConsumption.test';

export const foodConsumedFrequently = createValidator({
  /** The id of the meal record. */
  id: t.string,
  /** The name of the meal record. */
  name: t.string,
  /** The timestamp of when the meal was created. */
  createdAt: t.string,
  /** The image url of the meal. */
  imageUrl: optional(t.string),
  /** Flag showing if meal is public (does not have associated account) */
  isPublic: t.boolean,
  /** Account associated with this meal. */
  account: optional(entity),
  /** Consumption information. This is calculated between specific start & end dates, if there are any bounds provided. */
  consumption: foodMealConsumption,
  /** Aggregation of nutrition values for the whole meal. */
  summary: foodFrequentSummary
});
