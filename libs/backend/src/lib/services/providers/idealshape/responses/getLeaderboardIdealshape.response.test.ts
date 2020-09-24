/**
 * GET /measurement/idealshape/leaderboard
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { challengeSummary, leaderboardItem } from '../../../shared/index.test';
import { GetLeaderboardIdealshapeResponse } from './getLeaderboardIdealshape.response';

export const getLeaderboardIdealshapeResponse = createTest<GetLeaderboardIdealshapeResponse>(
  'GetLeaderboardIdealshapeResponse',
  {
    /** Leaderboard data. */
    leaderboard: t.array(leaderboardItem),
    /** Challenge summary. */
    summary: challengeSummary
  }
);
