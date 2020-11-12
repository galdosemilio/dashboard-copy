import { ApiService } from '../../services/api.service'
import { AddLogRequest } from './requests'

/**
 * Logging provider for sumologic interaction
 */
class Logging {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Add Log
   * @param addLogRequest must implement AddLogRequest
   * @returns void
   */
  public add(addLogRequest: AddLogRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/logging`,
      method: `POST`,
      version: '2.0',
      data: addLogRequest
    })
  }
}

export { Logging }
