/**
 * GET /measurement/body/sampled
 */

import { SummaryData } from './summaryData.interface'

export interface GetSampledMeasurementBodyRequest {
  /** Account for which the sampled measurement should be retrieved. Automatically filled in for clients. */
  account?: string
  /** The requested sample count (defaults to 5). */
  count?: number
  /** Data point to retrieve (defaults to weight) */
  data?: SummaryData
}
