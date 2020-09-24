import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import { CreateFoodMealOrganizationRequest, UpdateFoodMealOrganizationRequest } from './requests';
import { FoodMealOrganizationSingle } from './responses';

@Injectable({
  providedIn: 'root'
})
export class FoodMealOrganization {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Associate meal with organization.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement CreateFoodMealOrganizationRequest
   * @return Promise<Entity>
   */
  public create(request: CreateFoodMealOrganizationRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/food/meal/organization`,
      method: 'POST',
      version: '1.0',
      data: request
    });
  }

  /**
   * Fetch single meal-organization association.
   * Permissions: Provider, Admin, OrgAdmin
   *
   * @param request must implement Entity
   * @return Promise<FoodMealOrganizationSingle>
   */
  public getSingle(request: Entity): Promise<FoodMealOrganizationSingle> {
    return this.apiService.request({
      endpoint: `/food/meal/organization/${request.id}`,
      method: 'GET',
      version: '1.0'
    });
  }

  /**
   * Update meal-organization association.
   * Permissions: Provider, Admin, OrgAdmin
   *
   * @param request must implement UpdateFoodMealOrganizationRequest
   * @return Promise<void>
   */
  public update(request: UpdateFoodMealOrganizationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/meal/organization`,
      method: 'PATCH',
      version: '1.0',
      data: request
    });
  }

  /**
   * Delete meal-organization association.
   * Permissions: Provider, Admin, OrgAdmin
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/meal/organization`,
      method: 'DELETE',
      version: '1.0',
      data: request
    });
  }
}
