/**
 * Interface for GET /measurement/sleep/summary (response)
 */

import { SummarySleepMeasurementResponseSegment } from './summarySleepMeasurementResponseSegment.interface'

export interface FetchSleepMeasurementSummaryResponse {
  data: Array<SummarySleepMeasurementResponseSegment>
  summary: {
    previousSleepStart?: string
    previousSleepEnd?: string
    previousSleepTotal?: number
    sleepMinutesAverage?: number
    sleepMinutesMax?: number
    sleepMinutesMin?: number
    sleepQualityAverage?: number
  }
}
