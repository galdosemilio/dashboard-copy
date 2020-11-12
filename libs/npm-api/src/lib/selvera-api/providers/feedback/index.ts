import { ApiService } from '../../services/api.service'
import { FeedbackRequest } from './requests/feedbackRequest.interface'
/**
 * Feedback Service.
 */
class Feedback {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Creates a feedback ticket from a client in Zendesk
   * @param data must implement FeedbackRequest
   * @returns Promise<string>
   */
  public sendFeedback(data: FeedbackRequest): Promise<string> {
    return this.apiService.request({
      endpoint: '/feedback',
      method: 'POST',
      data: data
    })
  }
}

export { Feedback }
