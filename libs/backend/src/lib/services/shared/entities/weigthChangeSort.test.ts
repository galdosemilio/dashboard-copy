/**
 * weigthChangeSort
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import { sortDirection } from '../generic/index.test';
import { weigthChangeSortProperty } from './weigthChangeSortProperty.test';

export const weigthChangeSort = createValidator({
  /**
   * Property to sort by. 'name' indicates account/client last name, 'provider' indicates provider last name.
   * 'percentage' and 'value' refer to weight changes.
   */
  property: optional(weigthChangeSortProperty),
  /** Sorting direction. */
  dir: optional(sortDirection)
});
