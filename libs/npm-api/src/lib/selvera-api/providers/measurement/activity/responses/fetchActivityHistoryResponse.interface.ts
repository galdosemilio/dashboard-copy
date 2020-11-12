/**
 * Interface for GET /measurement/activity/history (response)
 */

import { ActivityHistoryResponseSegment } from './activityHistorySegmentResponse.interface'

export interface FetchActivityHistoryResponse {
  history: Array<ActivityHistoryResponseSegment>
}
