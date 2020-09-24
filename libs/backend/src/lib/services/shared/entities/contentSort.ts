/**
 * ContentSort
 */

import { SortDirection } from '../generic';
import { ContentSortProperty } from './contentSortProperty';

export interface ContentSort {
  /** A property to sort by. */
  property?: ContentSortProperty;
  /** Sort direction. */
  dir?: SortDirection;
}
