/**
 * ActivityReportSort
 */

import { SortDirection } from '../generic';
import { ActivityReportSortProperty } from './activityReportSortProperty';

export interface ActivityReportSort {
  /**
   * Property to sort by. 'name' indicates account/client last name, 'provider' indicates provider last name.
   * 'activityLevel' refer to provided activity levels.
   */
  property?: ActivityReportSortProperty;
  /** Sorting direction. */
  dir?: SortDirection;
}
