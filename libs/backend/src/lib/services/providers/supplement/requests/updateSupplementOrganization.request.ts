/**
 * PUT /supplement/organization/:id
 */

export interface UpdateSupplementOrganizationRequest {
  /** ID of the supplement-organization association. */
  id: string;
  /** The default dosage of the supplement for the organization. */
  dosage?: number;
  /** Custom sort order for supplement-organization association. */
  sortOrder?: number;
}
