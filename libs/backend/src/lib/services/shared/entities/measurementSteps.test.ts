/**
 * measurementSteps
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const measurementSteps = createValidator({
  /** Maximum recorded step value in the selected period & time unit. */
  max: t.number,
  /** Minimum recorded step value in the selected period & time unit. */
  min: t.number,
  /** Average step value in the selected period & time unit. */
  avg: t.number,
  /** Total steps in the selected period & time unit. */
  total: t.number
});
