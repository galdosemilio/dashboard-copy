/**
 * SleepReportSort
 */

import { SortDirection } from '../generic';
import { SleepReportSortProperty } from './sleepReportSortProperty';

export interface SleepReportSort {
  /**
   * Property to sort by. 'name' indicates account/client last name, 'provider' indicates provider last name.
   * 'hourSum', hourMin', 'hourMax', 'hourAvg' refer to returned slept hours.
   */
  property?: SleepReportSortProperty;
  /** Sorting direction. */
  dir?: SortDirection;
}
