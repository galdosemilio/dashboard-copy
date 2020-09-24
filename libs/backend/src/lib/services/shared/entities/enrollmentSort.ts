/**
 * EnrollmentSort
 */

import { EnrollmentSortDirection } from './enrollmentSortDirection';
import { EnrollmentSortProperty } from './enrollmentSortProperty';

export interface EnrollmentSort {
  /** A property to sort by. */
  property: EnrollmentSortProperty;
  /** Sort direction. */
  dir?: EnrollmentSortDirection;
}
