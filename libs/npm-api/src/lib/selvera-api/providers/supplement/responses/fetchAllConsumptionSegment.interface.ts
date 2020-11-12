/**
 * Interface for GET /supplement/consumption (Response)
 */

import { SupplementConsumptionResponse } from './supplementResponse.interface'

export interface FetchAllConsumptionSegment {
  date: string
  consumption: Array<SupplementConsumptionResponse>
}
