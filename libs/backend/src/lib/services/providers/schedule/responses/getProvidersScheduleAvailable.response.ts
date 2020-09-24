/**
 * GET /available/match
 */

export interface GetProvidersScheduleAvailableResponse {
  /** Array of providers account IDs with available time. */
  providers: Array<string>;
}
