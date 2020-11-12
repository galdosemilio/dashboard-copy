/**
 * Interface for GET /chart
 */

import { SummaryUnit } from '../../common/types'
import { SummaryData } from './bodySummaryData.interface'
import { SummaryAggregation } from './summaryAggregation.interface'

export interface BodyMeasurementRequest {
  account?: number | string
  startDate: string
  endDate?: string
  unit: SummaryUnit
  data?: Array<SummaryData>
  max?: number | 'all'
  aggregation?: SummaryAggregation
}
