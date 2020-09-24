/**
 * TimestampFilter
 */

export interface TimestampFilter {
  /** Includes notifications created after start time. */
  start?: string;
  /** Includes notifications created before end time. */
  end?: string;
}
