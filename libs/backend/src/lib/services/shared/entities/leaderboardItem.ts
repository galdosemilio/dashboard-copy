/**
 * LeaderboardItem
 */

import { ChallengeLoss } from './challengeLoss';

export interface LeaderboardItem {
  /** Account ID. */
  id: string;
  /** Participant's first name. */
  firstName: string;
  /** Participant's last name. */
  lastName: string;
  /** Weight loss data. */
  loss: ChallengeLoss;
}
