import { MeasurementDevice } from '../entities'

/**
 * Interface for GET /device (Response)
 */

export interface FetchAllDevicesResponse {
  data: Array<MeasurementDevice>
}
