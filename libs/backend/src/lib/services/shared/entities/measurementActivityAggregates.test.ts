/**
 * measurementActivityAggregates
 */

import { createValidator } from '@coachcare/backend/tests';
import { measurementSteps } from './measurementSteps.test';

export const measurementActivityAggregates = createValidator({
  /** Steps aggregates. */
  steps: measurementSteps
});
