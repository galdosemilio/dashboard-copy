import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { ClientRegisterRequest, ClinicRegisterRequest } from './requests';
import { ClientRegisterResponse, ClinicRegisterResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class Register {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Register a new client account.  After the account is created, the user will be logged in.
   * This endpoint is accessible to a public or private user EXCEPT for an authenticated client.
   * Permissions: Public
   *
   * @param request must implement ClientRegisterRequest
   * @return Promise<ClientRegisterResponse>
   */
  public client(request: ClientRegisterRequest): Promise<ClientRegisterResponse> {
    return this.apiService.request({
      endpoint: `/client/register`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Register new CCR organization and associated provider account and create stripe customer.
   * Permissions: Public
   *
   * @param request must implement ClinicRegisterRequest
   * @return Promise<ClinicRegisterResponse>
   */
  public clinic(request: ClinicRegisterRequest): Promise<ClinicRegisterResponse> {
    return this.apiService.request({
      endpoint: `/ccr/register`,
      method: 'POST',
      version: '3.0',
      data: request
    });
  }
}
