/**
 * GET /supplement/account/organization/
 */

export interface GetAllSupplementAccountOrganizationRequest {
  /** Supplement-organization entry ID. */
  supplementOrganization: string;
  /** Client account ID. Optional for Client requests, otherwise required. */
  account?: string;
}
