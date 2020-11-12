/**
 * Interface for GET /measurement/sleep/summary
 */
import { SummaryData } from './summaryData.interface'
import { SummaryUnit } from './summaryUnit.interface'

export interface FetchSleepMeasurementSummaryRequest {
  account?: string
  data: Array<SummaryData>
  startDate: string
  endDate?: string
  max?: number | 'all'
  unit: SummaryUnit
}
