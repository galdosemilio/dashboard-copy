/**
 * Interface for GET chart/bodyFat (response)
 */

import { DataSegment } from './dataSegment.interface'
import { SummarySegment } from './summarySegment.interface'

export interface BodyFatResponse {
  data: Array<DataSegment>
  summary: SummarySegment
}
