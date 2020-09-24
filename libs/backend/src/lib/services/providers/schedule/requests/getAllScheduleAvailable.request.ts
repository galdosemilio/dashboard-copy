/**
 * GET /available
 */

export interface GetAllScheduleAvailableRequest {
  /**
   * The id of the provider to fetch availability for.
   * If the current user is a provider and the parameter is missing, their ID will be used by default.
   */
  provider?: string;
}
