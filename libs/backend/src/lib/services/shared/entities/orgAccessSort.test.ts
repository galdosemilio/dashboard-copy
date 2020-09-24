/**
 * orgAccessSort
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import { sortDirection } from '../generic/index.test';
import { orgAccessSortProperty } from './orgAccessSortProperty.test';

export const orgAccessSort = createValidator({
  /** A property to sort by. */
  property: orgAccessSortProperty,
  /** Sort direction. */
  dir: optional(sortDirection)
});
