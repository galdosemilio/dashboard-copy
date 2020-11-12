/**
 * Interface for GET /chart/leanMuscleMass
 */

import { SummaryUnit } from '../../common/types'
import { SummaryData } from './activitySummaryData.interface'

export interface ActivityMeasurementRequest {
  account?: string
  startDate: string
  endDate?: string
  unit: SummaryUnit
  data?: Array<SummaryData>
  max?: number | 'all'
  device?: string
}
