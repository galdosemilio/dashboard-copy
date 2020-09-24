/**
 * summaryChange
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const summaryChange = createValidator({
  /** Change numeric value. */
  value: t.number,
  /** Change percentage, compared to the first value recorded. */
  percentage: t.number
});
