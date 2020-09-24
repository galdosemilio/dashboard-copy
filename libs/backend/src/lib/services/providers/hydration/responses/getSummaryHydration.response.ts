/**
 * GET /hydration/summary
 */

export interface GetSummaryHydrationResponse {
  /** An object of hydration arrays. */
  hydration: Array<{
    /** The date that starts the week or month. */
    date: string;
    /** The total number of mL drank over this period. */
    total: number;
    /** The maximum number of mL drank on any one day of this period. */
    max: number;
    /** The average number of mL drank on any day within this period. */
    average: number;
  }>;
}
