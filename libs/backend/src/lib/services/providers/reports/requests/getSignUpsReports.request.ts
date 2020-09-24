/**
 * GET /warehouse/organization/sign-ups
 */

export interface GetSignUpsReportsRequest {
  /** The ID of an organization to run the report for. */
  organization: string;
  /** Report with data that start at or after this time, in ISO8601 format. */
  startDate?: string;
  /** Report with data that end at or before this time, in ISO8601 format. */
  endDate?: string;
  /** Generate report including inactive organizations. */
  includeInactiveOrganizations?: boolean;
}
