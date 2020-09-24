/**
 * GET /supplement/summary
 */

import { SupplementConsumed } from '../../../shared';

export interface GetSummarySupplementResponse {
  /** A summary collection. */
  summary: Array<{
    /** The date that starts the week or month. */
    date: string;
    /** Supplement consumption. */
    consumption: Array<{
      /** Supplement consumed. */
      supplement: SupplementConsumed;
      /** Quantity consumed. */
      quantity: number;
    }>;
  }>;
}
