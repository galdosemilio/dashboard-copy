/**
 * GET /warehouse/organization/sign-ups/timeline
 */

export interface GetSignUpsTimelineReportsRequest {
  /** The ID of an organization to run the report for. */
  organization: string;
  /** Report with data that start at or after this time, in ISO8601 format. */
  startDate?: string;
  /** Report with data that end at or before this time, in ISO8601 format. */
  endDate?: string;
  /** A unit to aggregate the sign ups over. */
  unit?: string;
  /**
   * Indicates a detailed mode.
   * If the flag is set to 'true', it will unroll all sign ups for all organizations below in the hierarchy.
   * Warning: can/will be slow!.
   */
  detailed?: boolean;
}
