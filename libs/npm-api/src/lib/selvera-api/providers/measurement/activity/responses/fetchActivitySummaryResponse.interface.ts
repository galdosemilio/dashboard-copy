/**
 * Interface for GET /measurement/activity/summary (response)
 */

import { SummaryActivityResponseSegment } from './summaryActivityResponseSegment.interface'

export interface FetchActivitySummaryResponse {
  data: Array<SummaryActivityResponseSegment>
  summary: {
    caloriesAverage?: number
    caloriesMax?: number
    caloriesMin?: number
    distanceAverage?: number
    distanceMax?: number
    distanceMin?: number
    stepsAverage?: number
    stepsMax?: number
    stepsMin?: number
  }
}
