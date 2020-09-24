/**
 * ScheduleAvailableItem
 */

export interface ScheduleAvailableItem {
  /** The id of this record. */
  id: string;
  /** The day this record corresponds to (0-6 :: Sunday - Saturday) */
  day: number;
  /** The account this record is connected to. */
  account: string;
  /** The start time of this record, in 24-hour format in 5 minute increments.  00:00 - 24:00. */
  startTime: string;
  /** The end time of this record, in 24-hour format in 5 minute increments.  00:00 - 24:00. */
  endTime: string;
  /** The timezone the availability corresponds to. */
  timezone: string;
}
