/**
 * leaderboardItem
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { challengeLoss } from './challengeLoss.test';

export const leaderboardItem = createValidator({
  /** Account ID. */
  id: t.string,
  /** Participant's first name. */
  firstName: t.string,
  /** Participant's last name. */
  lastName: t.string,
  /** Weight loss data. */
  loss: challengeLoss
});
