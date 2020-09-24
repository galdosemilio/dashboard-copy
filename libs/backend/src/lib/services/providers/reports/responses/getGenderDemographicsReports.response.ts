/**
 * GET /warehouse/demographics/gender
 */

export interface GetGenderDemographicsReportsResponse {
  /** Aggregate collection. */
  data: Array<{
    /** Organization data. */
    organization: {
      /** Organization ID. */
      id: string;
      /** Organization name. */
      name: string;
    };
    /** Male gender breakdown. */
    male: {
      /** Count of male clients. */
      count: number;
      /** Percentage of male clients. */
      percentage: number;
    };
    /** Female gender breakdown. */
    female: {
      /** Count of female clients. */
      count: number;
      /** Percentage of female clients. */
      percentage: number;
    };
  }>;
}
