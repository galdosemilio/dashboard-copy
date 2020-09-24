/**
 * enrollmentSort
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import { enrollmentSortDirection } from './enrollmentSortDirection.test';
import { enrollmentSortProperty } from './enrollmentSortProperty.test';

export const enrollmentSort = createValidator({
  /** A property to sort by. */
  property: enrollmentSortProperty,
  /** Sort direction. */
  dir: optional(enrollmentSortDirection)
});
