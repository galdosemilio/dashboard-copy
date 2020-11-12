/**
 * Interface for GET /measurement/body (response)
 */
import { PaginationRecord } from '../entities'
import { FetchBodyMeasurementDataResponse } from './fetchBodyMeasurementDataResponse.interface'

export interface FetchBodyMeasurementResponse {
  data: Array<FetchBodyMeasurementDataResponse>
  pagination?: PaginationRecord
}
