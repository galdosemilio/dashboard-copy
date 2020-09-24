/**
 * GET /warehouse/provider/count
 */

export interface GetProviderCountReportsResponse {
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
      /** A number of active providers. */
      count: string;
    }>;
  }>;
}
