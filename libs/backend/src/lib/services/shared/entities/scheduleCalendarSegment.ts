/**
 * ScheduleCalendarSegment
 */

export interface ScheduleCalendarSegment {
  /**
   * Calendar availability entry ID array. A single entry in an array indicates an actual calendar entry.
   * More than one entry in the collection indicates that the entry has been merged with another entry.
   */
  ids: Array<string>;
  /** Account ID. */
  account: string;
  /** Start time of availability window in UTC. */
  startTime: string;
  /** End time of availability window in UTC. */
  endTime: string;
  /** Account timezone. */
  timezone: string;
  /** Indicates whether the item is a non-recurring availability entry. */
  isSingle: boolean;
}
