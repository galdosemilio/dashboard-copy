/**
 * measuredValue
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const measuredValue = createValidator({
  /** Actual value. */
  value: t.number,
  /** Unit of the value. */
  unit: t.string
});
