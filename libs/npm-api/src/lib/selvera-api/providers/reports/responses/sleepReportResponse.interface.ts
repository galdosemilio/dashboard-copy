/**
 * Interface for /warehouse/sleep/basic
 */

import { PaginationResponse } from '../../common/entities'
import { SleepReportSegment } from '../entities'

export interface SleepReportResponse {
  data: Array<SleepReportSegment>
  pagination: PaginationResponse
}
