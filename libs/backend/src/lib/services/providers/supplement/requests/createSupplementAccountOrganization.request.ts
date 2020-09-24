/**
 * POST /supplement/account/organization/
 */

export interface CreateSupplementAccountOrganizationRequest {
  /** Supplement-organization entry ID. */
  supplementOrganization: string;
  /** Client account ID. */
  account: string;
  /** Create client-specific dosage for supplement-organization entry. */
  dosage?: number;
}
