/**
 * POST /conference/billing
 */

export interface GetSummaryConferenceBillingRequest {
  /** Organization ID. */
  organization: string;
  /** Start date. */
  start?: string;
  /** End date. */
  end?: string;
  /**
   * A flag indicating whether to retrieve billing only for the top-level organization in the hierarchy.
   * By default retrieves billing for all child organizations.
   */
  strict?: boolean;
  /** A flag indicating whether to include inactive subaccounts in the billing summary. */
  includeInactive?: boolean;
}
