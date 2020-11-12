/**
 * IncludeRecord
 */

import { SummaryProperty } from './summaryProperty'

export interface IncludeRecord {
  /** Property name to include. Can be one of the measurement property names. */
  property: SummaryProperty
  /** A flag indicating whether to only include measurements with the property values that are > 0 or not */
  positiveOnly?: boolean
}
