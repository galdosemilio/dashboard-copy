/**
 * AccAccessSort
 */

import { AccAccessSortProperty } from './accAccessSortProperty'
import { SortDirection } from './sortDirection'

export interface AccAccessSort {
  /** A property to sort by. */
  property: AccAccessSortProperty
  /** Sort direction. */
  dir?: SortDirection
}
