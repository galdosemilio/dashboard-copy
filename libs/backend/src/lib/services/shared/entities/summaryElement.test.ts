/**
 * summaryElement
 */

import { createValidator } from '@coachcare/backend/tests';
import { summaryChange } from './summaryChange.test';
import { summaryRecord } from './summaryRecord.test';

export const summaryElement = createValidator({
  /** Key property record data. */
  record: summaryRecord,
  /** Change value. */
  change: summaryChange
});
