/**
 * GET /warehouse/organization/sign-ups
 */

export interface GetSignUpsReportsResponse {
  /** Array of report results. */
  data: Array<{
    /** Organization data. */
    organization: {
      /** Organization ID. */
      id: string;
      /** Organization name. */
      name: string;
    };
    /** A number of new sign ups. */
    signUps: string;
  }>;
}
