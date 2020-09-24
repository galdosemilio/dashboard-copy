/**
 * GET /measurement/idealshape/leaderboard
 */

import { ChallengeSummary, LeaderboardItem } from '../../../shared';

export interface GetLeaderboardIdealshapeResponse {
  /** Leaderboard data. */
  leaderboard: Array<LeaderboardItem>;
  /** Challenge summary. */
  summary: ChallengeSummary;
}
