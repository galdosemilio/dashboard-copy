/**
 * SummaryRecord
 */

import { Record } from './record'

export interface SummaryRecord {
  /** First record. */
  first: Record
  /** Last record. */
  last: Record
  /** Count of the records with the specified data point in given date range. */
  count: number
}
