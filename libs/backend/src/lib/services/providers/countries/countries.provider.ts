import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { GetAllCountriesRequest } from './requests';
import { GetAllCountriesResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class Countries {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Retrieves a paginated list of countries.
   * Permissions: Public
   *
   * @param [request] must implement GetAllCountriesRequest
   * @return Promise<GetAllCountriesResponse>
   */
  public getAll(request?: GetAllCountriesRequest): Promise<GetAllCountriesResponse> {
    return this.apiService.request({
      endpoint: `/country`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }
}
