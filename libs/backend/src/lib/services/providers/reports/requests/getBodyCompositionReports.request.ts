/**
 * GET /warehouse/measurement/body-composition
 */

export interface GetBodyCompositionReportsRequest {
  /** An organization ID to run the report for. */
  organization: string;
  /** A metric to calculate the report for. */
  metric: string;
  /** A data property to calculate the report for. */
  data: string;
  /**
   * A report mode to either roll up the data to the top of the specified hierarchy,
   * or run a detailed analysis on the whole hierarchy.
   */
  mode?: string;
}
