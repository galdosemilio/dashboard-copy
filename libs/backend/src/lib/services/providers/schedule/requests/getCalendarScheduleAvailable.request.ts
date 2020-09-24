/**
 * GET /available/calendar
 */

export interface GetCalendarScheduleAvailableRequest {
  /** The array of provider id's to search through. Is conditionally required by the service if calendar IDs are missing. */
  providers?: Array<string>;
  /**
   * The array of calendar entry IDs to retrieve. Skips date/time based filters.
   * Will retrieve IDs for matching providers if the parameter is supplied.
   */
  calendarIds?: Array<string>;
  /** Start date & time of the availability calendar range (with timezone) */
  startTime?: string;
  /** End date & time of the availability calendar range (with timezone) */
  endTime?: string;
}
