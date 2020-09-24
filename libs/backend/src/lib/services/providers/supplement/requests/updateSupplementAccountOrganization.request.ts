/**
 * PUT /supplement/account/organization/:id
 */

export interface UpdateSupplementAccountOrganizationRequest {
  /** Supplement-organization-account association ID. */
  id: string;
  /** Create client-specific dosage for supplement-organization entry. */
  dosage?: number;
}
