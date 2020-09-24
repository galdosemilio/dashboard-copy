import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleReports {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch a list of all meetings by each account.
   * Permissions: Admin
   *
   * @return Promise<string> CSV string of all meetings by account
   */
  public getAllMeetings(): Promise<string> {
    return this.apiService.request({
      endpoint: `/schedule/reporting`,
      method: 'GET',
      version: '2.0'
    });
  }
}
