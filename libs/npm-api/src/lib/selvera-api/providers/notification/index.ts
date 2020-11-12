import { ApiService } from '../../services'
import { Entity } from '../common/entities'
import { FetchTokenRequest, RegisterRequest } from './requests'
import { FetchTokenResponse } from './responses'

/**
 * Notification Service
 */
export class Notification {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Register push notification token
   * @param request must implement RegisterRequest
   * @returns Promise<Entity>
   */
  public register(request: RegisterRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: '/notification/mobile-push/client',
      method: 'PUT',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Register APN device token (ios only)
   * @param request must implement RegisterRequest
   * @returns Promise<Entity>
   */
  public registerAPN(request: RegisterRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: '/notification/mobile-push/apn/device',
      method: 'PUT',
      data: request,
      version: '1.0'
    })
  }

  /**
   * Get all tokens
   * @param request must implement FetchTokensRequest
   * @returns Promise<Array<FetchTokensResponse>>
   */
  public getAll(
    request: FetchTokenRequest
  ): Promise<Array<FetchTokenResponse>> {
    return this.apiService.request({
      endpoint: '/notification/mobile-push/client',
      method: 'GET',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Get token
   * @param entity must implement Entity
   * @returns Promise<FetchTokensResponse>
   */
  public getSingle(entity: Entity): Promise<FetchTokenResponse> {
    return this.apiService.request({
      endpoint: `/notification/mobile-push/client/${entity.id}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Delete registration
   * @param entity must implement Entity
   * @returns Promise<void>
   */
  public delete(entity: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/notification/mobile-push/client/${entity.id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }
}
