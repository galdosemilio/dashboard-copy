/**
 * contentSort
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import { sortDirection } from '../generic/index.test';
import { contentSortProperty } from './contentSortProperty.test';

export const contentSort = createValidator({
  /** A property to sort by. */
  property: optional(contentSortProperty),
  /** Sort direction. */
  dir: optional(sortDirection)
});
