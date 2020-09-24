/**
 * record
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const record = createValidator({
  /** ID of the measurement entry. */
  id: t.string,
  /** Recorded at timestamp. */
  recordedAt: t.string,
  /** Value of the record. */
  value: t.number
});
