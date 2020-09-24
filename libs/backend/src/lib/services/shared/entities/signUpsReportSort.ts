/**
 * SignUpsReportSort
 */

import { SortDirection } from '../generic';
import { SignUpsReportSortProperty } from './signUpsReportSortProperty';

export interface SignUpsReportSort {
  /**
   * Property to sort by. 'name' indicates account/client last name, 'provider' indicates provider last name.
   * 'percentage' and 'value' refer to weight changes.
   */
  property?: SignUpsReportSortProperty;
  /** Sorting direction. */
  dir?: SortDirection;
}
