/**
 * POST /available
 */

export interface CreateRecurrentScheduleAvailableRequest {
  /**
   * The provider account to create the record for.
   * If the current user is a provider and the parameter is missing, their ID will be used by default.
   */
  provider?: string;
  /**
   * The day that the startTime corresponds to.
   * (0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday)
   */
  startDay: number;
  /**
   * The day that the endTime corresponds to.
   * (0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday)
   * Can only be a maximum of one day beyond startDay, for a maximum of 24 hours.
   */
  endDay: number;
  /**
   * The start time of this record, represented as HH:MM.  Hours must be in 24-hour format.  Minutes must be divisble by 5.
   * Time is passed without timezone, and ultimately manipulated using provider's timezone preference in DB.
   */
  startTime: string;
  /**
   * The end time of this record, represented as HH:MM.  Hours must be in 24-hour format.  Minutes must be divisble by 5.
   * Time is passed without timezone, and ultimately manipulated using provider's timezone preference in DB.
   */
  endTime: string;
}
