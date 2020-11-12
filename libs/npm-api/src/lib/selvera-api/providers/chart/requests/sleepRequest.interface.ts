/**
 * Interface for GET /measurement/sleep/summary
 */
import { SummaryUnit } from '../../common/types'
import { SleepData } from './sleepData.interface'

export interface SleepRequest {
  account?: string
  data?: Array<SleepData>
  startDate: string
  endDate?: string
  max?: number | 'all'
  unit?: SummaryUnit
}
