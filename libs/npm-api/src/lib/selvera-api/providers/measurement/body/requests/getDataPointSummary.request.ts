import { DateRange } from '../../../reports/entities'

export interface GetDataPointSummaryRequest {
  /** Account ID */
  account: string
  /**
   * Data point type grouping mode.
   * 'independent' (default) mode takes into account all data points.
   * 'in-group' mode takes into account data points of provided types measured together in the same group.
   * Requires type parameter to work. If type parameter is missing, the 'in-group' mode is discarded.
   *
   * Default value : independent
   */
  mode?: 'independent' | 'in-group'
  /** Recorded at timestamp range */
  recordedAt?: DateRange
  /** Data point source ID collection to filter by */
  source?: string[]
  /** Timezone to use for timestamp conversions and aggregates */
  timezone?: string
  /** Data point type ID collection to filter by */
  type?: string[]
}
