/**
 * challengeLoss
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const challengeLoss = createValidator({
  /** Weight loss value in grams. */
  value: t.number,
  /** Weight loss value in percentage. */
  percentage: t.number
});
