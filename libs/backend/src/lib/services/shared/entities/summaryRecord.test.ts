/**
 * summaryRecord
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { record } from './record.test';

export const summaryRecord = createValidator({
  /** First record. */
  first: record,
  /** Last record. */
  last: record,
  /** Count of the records with the specified data point in given date range. */
  count: t.number
});
