/**
 * challengeSummary
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { cumulativeLossItem } from './cumulativeLossItem.test';

export const challengeSummary = createValidator({
  /** Start date. */
  start: t.string,
  /** End date. */
  end: t.string,
  /** Days left to the end of the challenge (0-365) */
  daysLeft: t.number,
  /** Cumulative weight loss across all participants. */
  cumulativeLoss: t.array(cumulativeLossItem)
});
