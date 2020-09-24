import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class System {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Indicates if the system is available.
   * Permissions: Public
   *
   * @return Promise<void>
   */
  public status(): Promise<void> {
    return this.apiService.request({
      endpoint: `/system`,
      method: 'GET',
      version: '1.0'
    });
  }
}
