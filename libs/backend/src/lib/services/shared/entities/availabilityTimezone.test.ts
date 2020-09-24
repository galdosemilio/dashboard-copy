/**
 * availabilityTimezone
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const availabilityTimezone = createValidator({
  /** The account to set timezone for. */
  account: t.string,
  /** The timezone name to set. */
  timezone: t.string
});
