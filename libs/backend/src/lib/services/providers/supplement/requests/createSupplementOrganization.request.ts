/**
 * POST /supplement/organization
 */

export interface CreateSupplementOrganizationRequest {
  /** ID of the supplement. */
  supplement: string;
  /** Organization ID. */
  organization: string;
  /** The default dosage of the supplement for the organization. */
  dosage?: number;
  /** The sort order for the supplement-organization association. */
  sortOrder?: number;
}
