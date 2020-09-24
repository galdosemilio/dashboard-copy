/**
 * GET /warehouse/demographics/gender
 */

export interface GetGenderDemographicsReportsRequest {
  /** A hierarchy of organizations to run the report for. */
  organizationHierarchy: Array<string>;
  /** Date for which the aggregations should be run, in ISO8601 format. */
  date: string;
  /**
   * Indicates whether the aggregates should be rolled up to parent organization.
   * (simple), or if all children organizations should be listed .detailed)
   */
  mode?: string;
}
