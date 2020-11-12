import {
  AddFoodConsumedRequest,
  CreateFoodConsumedRequest,
  GetAllFoodConsumedRequest,
  GetFrequentFoodConsumedRequest
} from './requests'
import {
  AddFoodConsumedResponse,
  FoodConsumedSingle,
  GetAllFoodConsumedResponse,
  GetFrequentFoodConsumedResponse,
  GetTypesFoodConsumedResponse
} from './responses'

import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'

export class FoodConsumed {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch all consumed entries, ordered in consumedAt descending order.
   * Clients are only able to retrieve consumed meals associated with their account. Providers can only fetch for their clients.
   * This endpoint returns paginated results.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetAllFoodConsumedRequest
   * @return Promise<GetAllFoodConsumedResponse>
   */
  public getAll(
    request: GetAllFoodConsumedRequest
  ): Promise<GetAllFoodConsumedResponse> {
    return this.apiService.request({
      endpoint: `/food/consumed`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }

  /**
   * Fetch all frequently consumed meals in their consumption count descending order.
   * Clients are only able to retrieve consumed meals associated with their account. Providers can only fetch for their clients.
   * This endpoint returns paginated results.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetFrequentFoodConsumedRequest
   * @return Promise<GetFrequentFoodConsumedResponse>
   */
  public getFrequent(
    request: GetFrequentFoodConsumedRequest
  ): Promise<GetFrequentFoodConsumedResponse> {
    return this.apiService.request({
      endpoint: `/food/consumed/frequent`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }

  /**
   * Fetch Single Consumed Meal. Clients can only fetch their own meals and providers can only fetch the meals of their clients.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement Entity
   * @return Promise<FoodConsumedSingle>
   */
  public getSingle(request: Entity): Promise<FoodConsumedSingle> {
    return this.apiService.request({
      endpoint: `/food/consumed/${request.id}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Add Consumed Meal.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement CreateFoodConsumedRequest
   * @return Promise<Entity>
   */
  public create(request: CreateFoodConsumedRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/food/consumed`,
      method: 'POST',
      version: '2.0',
      data: request
    })
  }

  /**
   * Add a consumed meal with custom meal.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement AddFoodConsumedRequest
   * @return Promise<AddFoodConsumedResponse>
   */
  public add(
    request: AddFoodConsumedRequest
  ): Promise<AddFoodConsumedResponse> {
    return this.apiService.request({
      endpoint: `/food/consumed/new`,
      method: 'POST',
      version: '3.0',
      data: request
    })
  }

  /**
   * Delete Consumed.
   * Clients can only delete meals they consumed and providers can only delete meals consumed by one of their clients.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/consumed/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Fetch all consumed Types.
   *
   * @return Promise<GetTypesFoodConsumedResponse>
   */
  public getTypes(): Promise<GetTypesFoodConsumedResponse> {
    return this.apiService.request({
      endpoint: `/food/consumed/type`,
      method: 'GET',
      version: '1.0'
    })
  }
}
