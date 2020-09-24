/**
 * summaryPair
 */

import { createValidator } from '@coachcare/backend/tests';
import { summaryElement } from './summaryElement.test';
import { summaryProperty } from './summaryProperty.test';

export const summaryPair = createValidator({
  /** Key property in the summary. */
  key: summaryProperty,
  /** Summary element value for specific key. */
  value: summaryElement
});
