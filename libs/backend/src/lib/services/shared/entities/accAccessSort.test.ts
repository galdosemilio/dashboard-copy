/**
 * accAccessSort
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import { sortDirection } from '../generic/index.test';
import { accAccessSortProperty } from './accAccessSortProperty.test';

export const accAccessSort = createValidator({
  /** A property to sort by. */
  property: accAccessSortProperty,
  /** Sort direction. */
  dir: optional(sortDirection)
});
