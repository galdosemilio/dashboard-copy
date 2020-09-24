/**
 * GET /supplement/organization
 */

import { Entity, Pagination, SupplementItem } from '../../../shared';

export interface GetAllSupplementOrganizationResponse {
  /** Collection of supplements for specified organizations. */
  data: Array<{
    /** ID of an organization-supplement association. */
    id: string;
    /** Organization object. */
    organization: Entity;
    /** Core supplement data. */
    supplement: SupplementItem;
    /** Dosage for the supplement for given organization. */
    dosage?: string;
  }>;
  /** Pagination object. */
  pagination: Pagination;
}
