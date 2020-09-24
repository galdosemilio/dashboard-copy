/**
 * activityReportSort
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import { sortDirection } from '../generic/index.test';
import { activityReportSortProperty } from './activityReportSortProperty.test';

export const activityReportSort = createValidator({
  /**
   * Property to sort by. 'name' indicates account/client last name, 'provider' indicates provider last name.
   * 'activityLevel' refer to provided activity levels.
   */
  property: optional(activityReportSortProperty),
  /** Sorting direction. */
  dir: optional(sortDirection)
});
