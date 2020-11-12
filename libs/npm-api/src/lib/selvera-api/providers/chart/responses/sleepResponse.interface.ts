/**
 * Interface for GET chart/sleep (response)
 */

import { SleepDataSegment } from './sleepDataSegment.interface'
import { SleepSummary } from './sleepSummary.interface'

export interface SleepResponse {
  data: Array<SleepDataSegment>
  summary: SleepSummary
}
