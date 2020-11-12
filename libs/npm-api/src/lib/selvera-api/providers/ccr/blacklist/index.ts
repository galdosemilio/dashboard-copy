import { BlacklistSegment } from '../../../providers/ccr/blacklist/responses'
import { ApiService } from '../../../services/api.service'

/**
 * CCR Blacklist Module
 */
class CCRBlacklist {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch CCR Blacklist
   * @returns BlacklistSegment
   */
  public fetchAll(): Promise<Array<BlacklistSegment>> {
    return this.apiService
      .request({
        endpoint: `/ccr/blacklist`,
        method: `GET`,
        version: '2.0'
      })
      .then((response) => {
        return response.data
      })
  }
}

export { CCRBlacklist }
