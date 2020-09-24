/**
 * GET /supplement/consumption
 */

import { SupplementConsumed } from '../../../shared';

export interface GetAllSupplementConsumptionResponse {
  /** The collection of consumption entries. */
  data: Array<{
    /** The date of the supplements' consumption. */
    date: string;
    /** The collection of supplements' consumption entries. */
    consumption: Array<{
      /** The consumption entry ID. */
      id: string;
      /** The supplement consumed. */
      supplement: SupplementConsumed;
      /** The number of this supplement taken. */
      quantity: number;
    }>;
  }>;
}
