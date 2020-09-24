/**
 * GET /schedule/summary
 */

export interface GetSummarySchedulerResponse {
  /** The number of minutes used for initial 1on1 meetings. */
  '1on1initialMinutes': number;
  /** The number of booked and attended sessions for initial 1on1 meetings. */
  '1on1initialSessions': number;
  /** The number of minutes used for 1on1 meetings. */
  '1on1Minutes': number;
  /** The number of booked and attended sessions for 1on1 meetings. */
  '1on1Sessions': number;
  /** The number of minutes used for circle meetings. */
  circleMinutes: number;
  /** The number of booked and attended sessions for circle meetings. */
  circleSession: number;
}
