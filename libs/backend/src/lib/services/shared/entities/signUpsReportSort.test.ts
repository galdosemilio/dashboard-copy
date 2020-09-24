/**
 * signUpsReportSort
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import { sortDirection } from '../generic/index.test';
import { signUpsReportSortProperty } from './signUpsReportSortProperty.test';

export const signUpsReportSort = createValidator({
  /**
   * Property to sort by. 'name' indicates account/client last name, 'provider' indicates provider last name.
   * 'percentage' and 'value' refer to weight changes.
   */
  property: optional(signUpsReportSortProperty),
  /** Sorting direction. */
  dir: optional(sortDirection)
});
