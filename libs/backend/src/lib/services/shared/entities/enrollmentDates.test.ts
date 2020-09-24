/**
 * enrollmentDates
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const enrollmentDates = createValidator({
  /** The time this enrollment was enrolled. */
  start: t.string,
  /** The time this enrollment was ended. */
  end: optional(t.string)
});
