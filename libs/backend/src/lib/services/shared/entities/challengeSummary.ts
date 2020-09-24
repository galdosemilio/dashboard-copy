/**
 * ChallengeSummary
 */

import { CumulativeLossItem } from './cumulativeLossItem';

export interface ChallengeSummary {
  /** Start date. */
  start: string;
  /** End date. */
  end: string;
  /** Days left to the end of the challenge (0-365) */
  daysLeft: number;
  /** Cumulative weight loss across all participants. */
  cumulativeLoss: Array<CumulativeLossItem>;
}
