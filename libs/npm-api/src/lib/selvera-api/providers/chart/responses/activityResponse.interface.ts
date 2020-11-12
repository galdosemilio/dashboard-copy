/**
 * Interface for GET chart/activity (response)
 */

import { ActivityDataResponseSegment } from './activityDataResponseSegment.interface'
import { ActivitySummary } from './activitySummary.interface'

export interface ActivityResponse {
  data: Array<ActivityDataResponseSegment>
  summary: ActivitySummary
}
