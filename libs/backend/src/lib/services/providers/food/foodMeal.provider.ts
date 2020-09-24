import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateFoodMealRequest,
  GetAllFoodMealRequest,
  GetPlansFoodMealRequest,
  GetSingleFoodMealRequest,
  UpdateFoodMealRequest
} from './requests';
import { FoodMealSingle, GetAllFoodMealResponse, GetPlansFoodMealResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class FoodMeal {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch all meals.
   * Permissions: OrgAccess, OrgClientPHI
   *
   * @param request must implement GetAllFoodMealRequest
   * @return Promise<GetAllFoodMealResponse>
   */
  public getAll(request: GetAllFoodMealRequest): Promise<GetAllFoodMealResponse> {
    return this.apiService.request({
      endpoint: `/food/meal`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch Single Meal.
   *
   * @param request must implement GetSingleFoodMealRequest
   * @return Promise<FoodMealSingle>
   */
  public getSingle(request: GetSingleFoodMealRequest): Promise<FoodMealSingle> {
    return this.apiService.request({
      endpoint: `/food/meal/${request.id}`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Add Meal.
   * Permissions: OrgAccess, OrgClientPHI
   *
   * @param request must implement CreateFoodMealRequest
   * @return Promise<Entity> The id of the newly-created meal
   */
  public create(request: CreateFoodMealRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/food/meal`,
        method: 'POST',
        version: '2.0',
        data: request
      })
      .then(res => ({ id: res.mealId.toString() }));
  }

  /**
   * Update a meal.
   *
   * @param request must implement UpdateFoodMealRequest
   * @return Promise<void>
   */
  public update(request: UpdateFoodMealRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/meal/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    });
  }

  /**
   * Remove a meal if there are no relations to the meal (i.e. no consumed entries, meal - organization associations)
   * Permissions: Admin
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/meal/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }

  /**
   * Fetch all meal plans.
   *
   * @param request must implement GetPlansFoodMealRequest
   * @return Promise<GetPlansFoodMealResponse>
   */
  public getPlans(request: GetPlansFoodMealRequest): Promise<GetPlansFoodMealResponse> {
    return this.apiService.request({
      endpoint: `/food/meal-plan`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }
}
