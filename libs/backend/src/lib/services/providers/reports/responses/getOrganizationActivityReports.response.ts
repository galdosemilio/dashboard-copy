/**
 * GET /warehouse/organization/activity
 */

export interface GetOrganizationActivityReportsResponse {
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
      /** Clients report object. */
      clients: {
        /** Number of active clients for requested organization. */
        total: number;
        /** Number of clients who has any API activity within requested dates range. */
        active: number;
      };
      /** Providers report object. */
      providers: {
        /** Number of active providers for requested organization. */
        total: number;
        /** Number of providers who has any API activity within requested dates range. */
        active: number;
      };
    }>;
  }>;
}
