/**
 * GET /warehouse/organization/activity/feature
 */

export interface GetUserActivityReportsRequest {
  /** The ID of an organization to run the report for. */
  organization: string;
  /** Report with data that start at or after this time, in ISO8601 format. */
  startDate: string;
  /** Report with data that end at or before this time, in ISO8601 format. */
  endDate: string;
  /** A package filter. */
  package?: string;
  /** A unit to aggregate the activity data over. */
  unit: string;
  /**
   * Indicates whether the aggregates should be rolled up to parent organization.
   * (simple), or if all children organizations should be listed .detailed)
   */
  mode?: string;
  /** Type of data to report on. */
  data: string;
}
