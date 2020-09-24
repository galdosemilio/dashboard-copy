import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { GetLeaderboardIdealshapeResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class Idealshape {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get IdealShape leaderboard data & summary.
   * Permissions: Public
   *
   * @return Promise<GetLeaderboardIdealshapeResponse>
   */
  public getLeaderboard(): Promise<GetLeaderboardIdealshapeResponse> {
    return this.apiService.request({
      endpoint: `/measurement/idealshape/leaderboard`,
      method: 'GET',
      version: '2.0'
    });
  }
}
