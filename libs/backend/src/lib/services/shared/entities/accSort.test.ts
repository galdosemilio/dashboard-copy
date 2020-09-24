/**
 * accSort
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import { sortDirection } from '../generic/index.test';
import { accSortProperty } from './accSortProperty.test';

export const accSort = createValidator({
  /** A property to sort by. */
  property: accSortProperty,
  /** Sort direction. */
  dir: optional(sortDirection)
});
