/**
 * GET /warehouse/organization/sign-ups/timeline
 */

export interface GetSignUpsTimelineReportsResponse {
  /** Array of report results. */
  data: Array<{
    /** Date of the aggregation. */
    date: string;
    /** All aggregates for specific dates. */
    aggregates: Array<{
      /** Organization object. */
      organization: {
        /** The id of organization. */
        id: string;
        /** The name of organization. */
        name: string;
      };
      /** A number of new sign ups. */
      signUps: string;
    }>;
  }>;
}
