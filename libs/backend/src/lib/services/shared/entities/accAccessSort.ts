/**
 * AccAccessSort
 */

import { SortDirection } from '../generic';
import { AccAccessSortProperty } from './accAccessSortProperty';

export interface AccAccessSort {
  /** A property to sort by. */
  property: AccAccessSortProperty;
  /** Sort direction. */
  dir?: SortDirection;
}
