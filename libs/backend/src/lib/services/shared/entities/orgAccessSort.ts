/**
 * OrgAccessSort
 */

import { SortDirection } from '../generic';
import { OrgAccessSortProperty } from './orgAccessSortProperty';

export interface OrgAccessSort {
  /** A property to sort by. */
  property: OrgAccessSortProperty;
  /** Sort direction. */
  dir?: SortDirection;
}
