/**
 * sleepReportSort
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import { sortDirection } from '../generic/index.test';
import { sleepReportSortProperty } from './sleepReportSortProperty.test';

export const sleepReportSort = createValidator({
  /**
   * Property to sort by. 'name' indicates account/client last name, 'provider' indicates provider last name.
   * 'hourSum', hourMin', 'hourMax', 'hourAvg' refer to returned slept hours.
   */
  property: optional(sleepReportSortProperty),
  /** Sorting direction. */
  dir: optional(sortDirection)
});
