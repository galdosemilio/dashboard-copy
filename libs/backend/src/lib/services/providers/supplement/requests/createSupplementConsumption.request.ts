/**
 * POST /supplement/consumption
 */

export interface CreateSupplementConsumptionRequest {
  /** Account association to post consumption. Optional for Client requests, otherwise required. */
  account?: string;
  /** Date of entry for consumption. */
  date: string;
  /** An array of objects for each supplement/quantity combo. */
  supplements: Array<{
    /** The ID of the supplement taken. */
    id: string;
    /** The quantity of this supplement taken. */
    quantity: number;
  }>;
}
