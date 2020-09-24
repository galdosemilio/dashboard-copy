/**
 * GET /scheduler
 */

export interface GetOpenTimeslotsSchedulerRequest {
  /** An array of accounts to fetch open timeslots for. */
  accounts?: Array<string>;
  /**
   * The day to fetch open timeslots for - previous day, start day, and following 5 days.  In YYYY-MM-DD format.
   * Will default today.
   */
  startDay?: string;
  /** The number of minutes required for meeting. */
  duration: number;
}
