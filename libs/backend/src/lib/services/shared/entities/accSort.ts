/**
 * AccSort
 */

import { SortDirection } from '../generic';
import { AccSortProperty } from './accSortProperty';

export interface AccSort {
  /** A property to sort by. */
  property: AccSortProperty;
  /** Sort direction. */
  dir?: SortDirection;
}
