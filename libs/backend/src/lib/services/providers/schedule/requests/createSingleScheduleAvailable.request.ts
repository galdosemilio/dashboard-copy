/**
 * POST /available/single
 */

export interface CreateSingleScheduleAvailableRequest {
  /**
   * The provider account to create the record for.
   * If the current user is a provider and the parameter is missing, their ID will be used by default.
   */
  provider?: string;
  /** Timestamp with timezone when the availability starts. */
  startTime: string;
  /** Timestamp with timezone when the availability ends. Has to be after startTime. */
  endTime: string;
}
