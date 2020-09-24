/**
 * GET /warehouse/provider/count
 */

export interface GetProviderCountReportsRequest {
  /** The id of the organization. */
  organization: string;
  /** Report with data that start at or after this time, in ISO8601 format. */
  startDate: string;
  /** Report with data that end at or before this time, in ISO8601 format. */
  endDate: string;
  /** A unit to aggregate the providers over. */
  unit: string;
  /**
   * Indicates whether the aggregates should be rolled up to parent organization.
   * (simple), or if all children organizations should be listed .detailed)
   */
  mode?: string;
}
