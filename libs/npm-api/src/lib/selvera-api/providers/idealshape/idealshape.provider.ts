import { ApiService } from '../../services/api.service';

import { GetLeaderboardIdealshapeResponse } from './responses';

export class Idealshape {
    public constructor(private readonly apiService: ApiService) {}

    /**
     * Get IdealShape leaderboard data & summary.
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
