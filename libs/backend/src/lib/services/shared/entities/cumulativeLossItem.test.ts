/**
 * cumulativeLossItem
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const cumulativeLossItem = createValidator({
  /** Entry date. */
  date: t.string,
  /** Cumulative loss value for the date. */
  value: t.number
});
