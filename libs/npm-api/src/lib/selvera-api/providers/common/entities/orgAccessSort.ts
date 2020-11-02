/**
 * OrgAccessSort
 */

import { OrgAccessSortProperty } from './orgAccessSortProperty'
import { SortDirection } from './sortDirection'

export interface OrgAccessSort {
  /** A property to sort by. */
  property: OrgAccessSortProperty
  /** Sort direction. */
  dir?: SortDirection
}
