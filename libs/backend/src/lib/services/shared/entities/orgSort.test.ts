/**
 * orgSort
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import { sortDirection } from '../generic/index.test';
import { orgSortProperty } from './orgSortProperty.test';

export const orgSort = createValidator({
  /** A property to sort by. */
  property: orgSortProperty,
  /** Sort direction. */
  dir: optional(sortDirection)
});
