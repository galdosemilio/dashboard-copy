import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { FetchErrorLogRequest, FetchUserLogRequest } from './requests';
import { ErrorLogEntry, FetchUserLogResponse, UserLogUnfiltered } from './responses';

@Injectable({
  providedIn: 'root'
})
class ApiLog {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get error log data from server for a specific date.
   * @param request must implement FetchErrorLogRequest
   * @returns Promise<Array<ErrorLogEntry>>
   */
  public fetchErrorLog(request?: FetchErrorLogRequest): Promise<Array<ErrorLogEntry>> {
    return this.apiService.request({
      endpoint: `/log/error`,
      method: 'GET',
      version: '1.0',
      data: request
    });
  }

  /**
   * Get API log history for a specific user.
   * @param request must implement FetchUserLogRequest
   * @returns Promise<FetchUserLogResponse>
   */
  public fetchUserLog(request: FetchUserLogRequest): Promise<FetchUserLogResponse> {
    return this.apiService
      .request({
        endpoint: `/log/${request.account}`,
        method: 'GET',
        version: '1.0',
        data: request
      })
      .then(
        (res): FetchUserLogResponse => ({
          data: res.log.map((entry: UserLogUnfiltered) => ({
            id: entry.id,
            account: entry.account_id,
            organization: entry.organization_id,
            uri: entry.uri,
            method: entry.method,
            authorized: entry.authorized === 't',
            ipAddress: entry.ip_address,
            userAgent: entry.user_agent,
            createdAt: entry.created_on,
            elapsedTime: entry.elapsed_time,
            appVersion: entry.app_version,
            appName: entry.app_name
          })),
          pagination: res.pagination
        })
      );
  }
}

export { ApiLog };
