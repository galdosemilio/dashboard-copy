/**
 * Interface for GET /summary
 */

import { DateUnitRequest } from './dateUnitRequest.type'

export interface FetchSupplementSummaryRequest {
  account: string
  startDate: string
  endDate?: string
  unit: DateUnitRequest
}
