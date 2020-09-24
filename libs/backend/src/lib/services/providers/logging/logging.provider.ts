import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { CreateLoggingRequest } from './requests';

@Injectable({
  providedIn: 'root'
})
export class Logging {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Creates a new log record from the front-end, and saves it in sumologic.
   *
   * @param request must implement CreateLoggingRequest
   * @return Promise<void>
   */
  public create(request: CreateLoggingRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/logging`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }
}
