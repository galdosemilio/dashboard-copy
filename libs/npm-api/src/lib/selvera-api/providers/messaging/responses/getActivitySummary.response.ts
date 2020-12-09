/**
 * Interface for GET /message/activity-summary
 */

import { Pagination } from '../../content/entities'
import { MessageActivitySummaryItem } from '../entities'

export interface GetMessageActivitySummaryResponse {
  data: MessageActivitySummaryItem[]
  pagination: Pagination
}
