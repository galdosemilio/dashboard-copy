/**
 * GET /warehouse/measurement/body-composition
 */

export interface GetBodyCompositionReportsResponse {
  /** Data collection. */
  data: Array<{
    /** Cohort week. */
    week: number;
    /** Average change of specific metric (value, percentage) of the selected data point. */
    avg: string;
    /** Organization data. */
    organization: {
      /** Organization ID. */
      id: string;
      /** Organization name. */
      name: string;
    };
  }>;
}
