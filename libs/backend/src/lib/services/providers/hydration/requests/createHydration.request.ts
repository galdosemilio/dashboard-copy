/**
 * POST /hydration
 */

export interface CreateHydrationRequest {
  /** Account associated to post hydration. Optional for Client requests, otherwise required. */
  account?: string;
  /** Date of entry for hydration, in YYYY-MM-DD format. */
  date: string;
  /** Amount of liquids/hydration that was consumed. */
  quantity: number;
  /** Shows which format that user drank the liquid (oz|cup|ml|liter) */
  unit: string;
}
