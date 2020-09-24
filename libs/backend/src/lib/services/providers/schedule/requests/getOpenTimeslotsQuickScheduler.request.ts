/**
 * GET /scheduler/quick
 */

export interface GetOpenTimeslotsQuickSchedulerRequest {
  /** The token to validate. */
  token: string;
  /** The day to start returning availability for. */
  startDay: string;
}
