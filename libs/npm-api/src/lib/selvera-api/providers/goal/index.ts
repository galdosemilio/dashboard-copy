import {
  FetchGoalRequest,
  UpdateGoalRequest
} from '../../providers/goal/requests'
import { FetchGoalResponse } from '../../providers/goal/responses'
import { ApiService } from '../../services/api.service'

/**
 * Goal fetching and updating goals
 */
class Goal {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Add/Update Goal
   * @param updateGoalRequest must implement UpdateGoalRequest
   * @returns void
   */
  public update(updateGoalRequest: UpdateGoalRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/goal`,
      method: `PUT`,
      data: updateGoalRequest
    })
  }

  /**
   * Fetch Goals
   * @param fetchGoalRequest must implement FetchGoalRequest
   * @returns FetchGoalResponse
   */
  public fetch(
    fetchGoalRequest?: FetchGoalRequest
  ): Promise<FetchGoalResponse> {
    return this.apiService.request({
      endpoint: `/goal`,
      method: `GET`,
      data: fetchGoalRequest
    })
  }
}

export { Goal }
