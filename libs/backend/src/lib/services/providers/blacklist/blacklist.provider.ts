import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class Blacklist {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Retrieves a list of providers that should not be viewed by clients.
   * Permissions: Client
   *
   * @return Promise<void>
   */
  public getAll(): Promise<void> {
    return this.apiService.request({
      endpoint: `/ccr/blacklist`,
      method: 'GET',
      version: '2.0'
    });
  }
}
