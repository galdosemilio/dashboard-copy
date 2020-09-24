/**
 * OrgSort
 */

import { SortDirection } from '../generic';
import { OrgSortProperty } from './orgSortProperty';

export interface OrgSort {
  /** A property to sort by. */
  property: OrgSortProperty;
  /** Sort direction. */
  dir?: SortDirection;
}
