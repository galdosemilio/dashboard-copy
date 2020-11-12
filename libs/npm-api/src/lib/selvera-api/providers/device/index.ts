import { ApiService } from '../../services'
import { FetchAllDevicesResponse } from './responses'

/**
 * Device Provider
 */
class Device {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch All Devices
   */
  public fetchAllDevices(): Promise<FetchAllDevicesResponse> {
    return this.apiService.request({
      endpoint: `/measurement/device`,
      method: 'GET',
      version: '2.0'
    })
  }
}

export { Device }
