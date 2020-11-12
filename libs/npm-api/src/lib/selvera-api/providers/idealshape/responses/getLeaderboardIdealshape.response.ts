/**
 * GET /measurement/idealshape/leaderboard
 */

import { ChallengeSummary, LeaderboardItem } from '../entities'

export interface GetLeaderboardIdealshapeResponse {
  /** Leaderboard data. */
  leaderboard: Array<LeaderboardItem>
  /** Challenge summary. */
  summary: ChallengeSummary
}
