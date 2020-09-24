/**
 * GET /scheduler
 */

export type GetOpenTimeslotsSchedulerResponse = Array<{
  /** The provider's account id. */
  account: string;
  /** The start time, in ISO8601 format. */
  startTime: string;
}>;
