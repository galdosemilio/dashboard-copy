import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CheckAccountRequest,
  CreateAccountRequest,
  GetAllAccountRequest,
  GetListAccountRequest,
  SetActiveAccountRequest,
  UpdateAccountRequest
} from './requests';
import {
  AccountSingle,
  GetAllAccountResponse,
  GetListAccountResponse,
  GetTitlesAccountResponse,
  GetTypesAccountResponse
} from './responses';

@Injectable({
  providedIn: 'root'
})
export class Account {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Checks if an account for specified e-mail address exists. Returns 404 if no accounts match the e-mail address.
   * Permissions: Public
   *
   * @param request must implement CheckAccountRequest
   * @return Promise<void>
   */
  public check(request: CheckAccountRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/account?email=${encodeURIComponent(request.email)}`,
      method: 'HEAD',
      version: '2.0'
    });
  }

  /**
   * Set an account to active/inactive. Deactivates all associations and assignments along with account deactivation.
   * Only admin users have permission to this endpoint.
   * Permissions: Admin
   *
   * @param request must implement SetActiveAccountRequest
   * @return Promise<void>
   */
  public setActive(request: SetActiveAccountRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/account/${request.id}/activity`,
      method: 'PATCH',
      version: '2.0',
      data: request
    });
  }

  /**
   * Creates a new account. Password for the account is generated automatically.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement CreateAccountRequest
   * @return Promise<Entity>
   */
  public create(request: CreateAccountRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/account`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Updates account.
   * Permissions: OrgAdmin
   *
   * @param request must implement UpdateAccountRequest
   * @return Promise<void>
   */
  public update(request: UpdateAccountRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/account/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch listing of user accounts. Restricted to admins.
   * Permissions: Admin
   *
   * @param [request] must implement GetAllAccountRequest
   * @return Promise<GetAllAccountResponse>
   */
  public getAll(request?: GetAllAccountRequest): Promise<GetAllAccountResponse> {
    return this.apiService.request({
      endpoint: `/account`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch single account data.
   * Permissions: OrgAccess
   *
   * @param request must implement Entity
   * @return Promise<AccountSingle>
   */
  public getSingle(request: Entity): Promise<AccountSingle> {
    return this.apiService.request({
      endpoint: `/account/${request.id}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Get the listing of all user types in the system. Restricted to Admins and Providers.
   * Permissions: Admin, Provider
   *
   * @return Promise<GetTypesAccountResponse>
   */
  public getTypes(): Promise<GetTypesAccountResponse> {
    return this.apiService.request({
      endpoint: `/account-type`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Get the listing of all titles in the system. Restricted to Admins and Providers.
   * Permissions: Admin, Provider
   *
   * @return Promise<GetTitlesAccountResponse>
   */
  public getTitles(): Promise<GetTitlesAccountResponse> {
    return this.apiService.request({
      endpoint: `/account-title`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Get a listing of accessible accounts for an account.
   * Permissions: Admin, Provider, Client, OrgAccess
   *
   * @param [request] must implement GetListAccountRequest
   * @return Promise<GetListAccountResponse>
   */
  public getList(request?: GetListAccountRequest): Promise<GetListAccountResponse> {
    return this.apiService.request({
      endpoint: `/access/account`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }
}
