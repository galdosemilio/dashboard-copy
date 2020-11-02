/**
 * Interface for GET /supplement/consumption (Response)
 */

import { PaginationResponse } from '../../common/entities'
import { FetchAllConsumptionSegment } from './fetchAllConsumptionSegment.interface'

export interface FetchAllConsumptionResponse {
  data: Array<FetchAllConsumptionSegment>
  pagination: PaginationResponse
}
