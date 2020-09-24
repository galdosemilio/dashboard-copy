/**
 * GET /scheduler/quick
 */

export type GetOpenTimeslotsQuickSchedulerResponse = Array<{
  /** The provider's account id. */
  account: number;
  /** The start time, in ISO8601 format. */
  startTime: string;
}>;
