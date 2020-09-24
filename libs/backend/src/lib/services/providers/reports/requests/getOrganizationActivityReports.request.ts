/**
 * GET /warehouse/organization/activity
 */

export interface GetOrganizationActivityReportsRequest {
  /** The ID of an organization to run the report for. */
  organization: string;
  /** Report with data that start at or after this time, in ISO8601 format. */
  startDate?: string;
  /** Report with data that end at or before this time, in ISO8601 format. */
  endDate?: string;
  /** A unit to aggregate the activity over. */
  unit?: string;
  /**
   * Indicates a detailed mode.
   * If the flag is set to 'true', it will unroll all accounts for all organizations below in the hierarchy.
   * Warning: can/will be slow!.
   */
  detailed?: boolean;
}
