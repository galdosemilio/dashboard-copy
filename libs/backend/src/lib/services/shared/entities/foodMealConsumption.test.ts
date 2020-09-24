/**
 * foodMealConsumption
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const foodMealConsumption = createValidator({
  /** Number of times the meal was consumed. */
  count: t.number,
  /** A percentage (rounded to 2 decimal places) which indicates what part of total meal consumption count this meal is. */
  percentage: t.number
});
