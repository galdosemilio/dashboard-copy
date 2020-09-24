/**
 * WeigthChangeSort
 */

import { SortDirection } from '../generic';
import { WeigthChangeSortProperty } from './weigthChangeSortProperty';

export interface WeigthChangeSort {
  /**
   * Property to sort by. 'name' indicates account/client last name, 'provider' indicates provider last name.
   * 'percentage' and 'value' refer to weight changes.
   */
  property?: WeigthChangeSortProperty;
  /** Sorting direction. */
  dir?: SortDirection;
}
