/**
 * sampledEntry
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const sampledEntry = createValidator({
  /** ID of measurement record. */
  id: t.string,
  /** The id of the account to which the measurement belongs. */
  account: t.string,
  /** The timestamp of the measurement record as an ISO date string. */
  recordedAt: t.string,
  /** The timestamp the measurement was updated. */
  updatedAt: optional(t.string),
  /** The value for requested data parameter. */
  value: t.number
});
